"""
FastAPI Router for Telephony & Exotel Voicebot Applet.
Provides:
- WebSocket endpoint: /ws/exotel/voice
- Health check endpoint: /api/telephony/health
- Mock test call endpoint: /api/telephony/test-call
"""

import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from config.telephony_config import telephony_config
from services.exotel_service import exotel_service
from services.voice_session_manager import voice_session_manager
from services.telephony_prompt_service import telephony_prompt_service
from services.stt_service import stt_service
from services.tts_service import tts_service
from services.telephony_audio_service import telephony_audio_service

router = APIRouter()
logger = logging.getLogger("grama_mitra.telephony_route")


class MockCallRequest(BaseModel):
    caller_phone: Optional[str] = "+919876543210"
    simulated_speech: Optional[str] = "நெல் இலை மஞ்சள் நோய்க்கு என்ன உரம் போட வேண்டும்?"


@router.websocket("/ws/exotel/voice")
async def exotel_voice_websocket(websocket: WebSocket):
    """
    Bidirectional WebSocket endpoint for Exotel AgentStream / Voicebot Applet.
    Exotel establishes this connection when an incoming farmer call reaches the Voicebot Applet.
    Streams 16-bit mono linear PCM audio (8000 Hz or 16000 Hz) encoded in base64.
    """
    await websocket.accept()
    current_stream_sid = None
    logger.info("[Exotel WebSocket] Connection accepted from telco gateway.")

    try:
        while True:
            raw_text = await websocket.receive_text()
            data = exotel_service.parse_inbound_message(raw_text)
            if not data:
                continue

            event_type = data.get("event")

            if event_type == "start":
                current_stream_sid = await exotel_service.handle_start_event(data, websocket)

            elif event_type == "media":
                await exotel_service.handle_media_event(data, websocket)

            elif event_type == "stop":
                await exotel_service.handle_stop_event(data)
                break

            elif event_type == "dtmf":
                dtmf_digit = data.get("dtmf", {}).get("digit", "")
                logger.info(f"[Exotel WebSocket] Caller pressed DTMF digit: {dtmf_digit}")

            elif event_type == "connected":
                logger.info(f"[Exotel WebSocket] Stream connected handshake: {data.get('protocol', 'AgentStream')}")

            elif event_type == "mark":
                logger.debug(f"[Exotel WebSocket] Playback mark reached: {data.get('mark', {}).get('name')}")

    except WebSocketDisconnect:
        logger.info(f"[Exotel WebSocket] Connection closed normally for stream {current_stream_sid}")
    except Exception as e:
        logger.error(f"[Exotel WebSocket] Error in telephony stream {current_stream_sid}: {e}")
        voice_session_manager.log_error(current_stream_sid or "UNKNOWN", str(e))
    finally:
        if current_stream_sid:
            voice_session_manager.remove_session(current_stream_sid)


@router.get("/health")
async def telephony_health():
    """
    Health check and operational telemetry endpoint for telephony.
    Used by load balancers, monitoring probes, and the Admin Settings UI.
    """
    stats = voice_session_manager.get_telemetry_stats()
    return JSONResponse(
        content={
            "status": "ok",
            "service": "Grama Mitra Telephony (Exotel AgentStream)",
            "telephony_enabled": stats["telephony_enabled"],
            "mock_mode": stats["mock_mode"],
            "audio_specs": {
                "format": "audio/x-l16",
                "sample_rate": telephony_config.sample_rate,
                "channels": telephony_config.channels,
                "chunk_size_ms": telephony_config.chunk_size_ms,
                "bytes_per_chunk": telephony_config.bytes_per_chunk,
            },
            "websocket_endpoint": "/ws/exotel/voice",
            "active_calls": stats["active_calls"],
            "total_test_sessions": stats["total_test_sessions"],
            "last_connection_time": stats["last_connection_time"],
            "recent_errors": stats["recent_errors"],
        }
    )


@router.post("/test-call")
async def mock_telephony_test_call(req: MockCallRequest):
    """
    Simulates a full end-to-end telephone call pipeline for mock testing without dialing a phone:
    Farmer Audio Frame -> STT -> Gemini AI Spoken Tamil -> TTS PCM -> Audio Chunks
    """
    # 1. Generate synthetic caller PCM audio
    sample_rate = telephony_config.sample_rate
    mock_pcm = telephony_audio_service.generate_synthetic_tone(
        duration_seconds=1.5,
        frequency=400.0,
        sample_rate=sample_rate,
    )

    # 2. Transcribe
    recognized_text = await stt_service.transcribe(
        audio_pcm=mock_pcm,
        sample_rate=sample_rate,
        language="ta-IN",
        mock_override_text=req.simulated_speech,
    )

    # 3. Generate Spoken Tamil Response
    ai_turn = await telephony_prompt_service.generate_telephony_response(
        farmer_speech=recognized_text,
        session_context={"caller_phone": req.caller_phone},
    )

    # 4. Synthesize to Exotel PCM Audio
    spoken_text = ai_turn["spoken_text"]
    tts_pcm = await tts_service.synthesize(
        text=spoken_text,
        language="ta-IN",
        target_sample_rate=sample_rate,
    )
    chunks = telephony_audio_service.chunk_audio(tts_pcm)

    # Record telemetry
    test_session = voice_session_manager.create_session(
        stream_sid=f"sim-test-{int(telephony_config.bytes_per_chunk)}",
        call_sid="sim-call-001",
        account_sid="sim-account",
        caller_phone=req.caller_phone,
    )
    test_session.record_turn(recognized_text, spoken_text, ai_turn["intent"], 250.0)
    voice_session_manager.remove_session(test_session.stream_sid)

    return {
        "status": "success",
        "simulated_farmer_speech": recognized_text,
        "spoken_response_tamil": spoken_text,
        "intent": ai_turn["intent"],
        "is_emergency": ai_turn["is_emergency"],
        "confidence": ai_turn["confidence"],
        "pcm_audio_bytes": len(tts_pcm),
        "total_exotel_chunks": len(chunks),
        "chunk_size_bytes": telephony_config.bytes_per_chunk,
    }

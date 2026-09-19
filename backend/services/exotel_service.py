"""
Exotel Service for Grama Mitra.
Implements the provider-adapter layer for Exotel AgentStream / Voicebot Applet WebSocket messages.
Manages bidirectional audio streaming, event serialization, barge-in / interruption, and speech turnaround.
"""

import json
import time
import logging
import asyncio
from typing import Dict, Any, Optional
from config.telephony_config import telephony_config
from services.telephony_audio_service import telephony_audio_service
from services.voice_session_manager import voice_session_manager, SessionState
from services.stt_service import stt_service
from services.tts_service import tts_service
from services.telephony_prompt_service import telephony_prompt_service

logger = logging.getLogger("grama_mitra.exotel")


class ExotelService:
    def __init__(self, config=telephony_config):
        self.config = config

    def parse_inbound_message(self, raw_message: str) -> Optional[Dict[str, Any]]:
        """Parses and validates incoming JSON text message from Exotel WebSocket."""
        try:
            return json.loads(raw_message)
        except Exception as e:
            logger.warning(f"Failed to parse incoming WebSocket message: {e}")
            return None

    def create_media_event(self, stream_sid: str, pcm_chunk: bytes) -> str:
        """
        Creates an Exotel outbound media event containing base64 linear PCM audio.
        """
        b64_payload = telephony_audio_service.encode_media_payload(pcm_chunk)
        payload = {
            "event": "media",
            "stream_sid": stream_sid,
            "media": {
                "payload": b64_payload,
            },
        }
        return json.dumps(payload)

    def create_clear_event(self, stream_sid: str) -> str:
        """
        Creates an Exotel clear event to immediately purge queued audio buffers on the telco side
        when caller speech interruption (barge-in) is detected.
        """
        payload = {
            "event": "clear",
            "stream_sid": stream_sid,
        }
        return json.dumps(payload)

    def create_mark_event(self, stream_sid: str, mark_name: str) -> str:
        """Creates an Exotel mark event to track playback progress milestones."""
        payload = {
            "event": "mark",
            "stream_sid": stream_sid,
            "mark": {
                "name": mark_name,
            },
        }
        return json.dumps(payload)

    async def handle_start_event(self, data: dict, websocket) -> str:
        """
        Handles Exotel 'start' event when call streaming begins.
        Initializes session, records caller metadata, and sends initial Tamil greeting.
        """
        stream_sid = data.get("stream_sid", "")
        start_data = data.get("start", {})
        call_sid = start_data.get("call_sid", "")
        account_sid = start_data.get("account_sid", "")
        custom_params = start_data.get("custom_parameters", {})
        caller_phone = custom_params.get("From", custom_params.get("caller_id", ""))

        session = voice_session_manager.create_session(
            stream_sid=stream_sid,
            call_sid=call_sid,
            account_sid=account_sid,
            caller_phone=caller_phone,
        )
        session.state = SessionState.GREETING
        logger.info(f"[Exotel] Call started — Stream: {stream_sid}, CallSID: {call_sid}")

        # Synthesize and stream Tamil welcome message to the farmer
        welcome_text = self.config.welcome_message_tamil
        await self.send_spoken_response(session, welcome_text, websocket, is_greeting=True)
        session.state = SessionState.LISTENING

        return stream_sid

    async def handle_media_event(self, data: dict, websocket):
        """
        Handles incoming media audio packets from Exotel.
        Decodes base64 PCM, tracks speech activity, detects end-of-speech silence,
        and triggers the speech recognition -> AI -> TTS turnaround.
        """
        stream_sid = data.get("stream_sid", "")
        media_data = data.get("media", {})
        payload_b64 = media_data.get("payload", "")

        session = voice_session_manager.get_session(stream_sid)
        if not session or session.state == SessionState.ENDED:
            return

        pcm_chunk = telephony_audio_service.decode_media_payload(payload_b64)
        if not pcm_chunk:
            return

        # Check for barge-in / interruption if the assistant is currently speaking
        if session.is_speaking:
            if telephony_audio_service.is_speech(pcm_chunk, threshold=450):
                logger.info(f"[Exotel] Caller barge-in detected on {stream_sid}! Interrupting bot speech.")
                session.interrupted = True
                session.is_speaking = False
                # Send clear event to Exotel to stop telco playback immediately
                clear_event = self.create_clear_event(stream_sid)
                await websocket.send_text(clear_event)

        # Check speech presence in current chunk
        has_speech = telephony_audio_service.is_speech(pcm_chunk)
        now = time.time()

        if has_speech:
            session.last_speech_time = now
            if not session.speech_detected_in_turn:
                session.speech_detected_in_turn = True
                session.turn_start_time = now
                session.state = SessionState.LISTENING
            session.append_inbound_audio(pcm_chunk)
        else:
            # Silence detected
            if session.speech_detected_in_turn:
                session.append_inbound_audio(pcm_chunk)
                silence_elapsed = now - session.last_speech_time
                speech_duration = now - session.turn_start_time

                # If silence duration exceeds threshold or max speech duration reached -> Process Turn
                if (
                    silence_elapsed >= self.config.silence_duration_seconds
                    or speech_duration >= self.config.max_speech_duration_seconds
                ):
                    session.state = SessionState.PROCESSING
                    logger.info(
                        f"[Exotel] End of speech detected on {stream_sid}. Silence: {silence_elapsed:.2f}s, Audio: {len(session.inbound_audio_buffer)} bytes"
                    )
                    await self.process_farmer_turn(session, websocket)

    async def process_farmer_turn(self, session, websocket):
        """
        Executes complete turn:
        1. STT: Transcribes buffered PCM audio to Tamil text.
        2. AI: Generates concise spoken Tamil response via Gemini.
        3. TTS: Synthesizes spoken Tamil response into 16-bit linear PCM audio.
        4. Audio Stream: Chunks into 100ms packets (multiples of 320 bytes) and sends over WebSocket.
        """
        t0 = time.time()
        inbound_audio = session.get_and_clear_inbound_audio()

        if not inbound_audio or len(inbound_audio) < 320:
            session.state = SessionState.LISTENING
            return

        # 1. Speech-to-Text
        farmer_text = await stt_service.transcribe(
            audio_pcm=inbound_audio,
            sample_rate=self.config.sample_rate,
            language="ta-IN",
        )
        logger.info(f"[Exotel Turn] Farmer asked: '{farmer_text}'")

        # 2. AI Reasoning & Spoken Tamil Response
        response_data = await telephony_prompt_service.generate_telephony_response(
            farmer_speech=farmer_text,
            session_context={"caller_phone": session.caller_phone},
        )
        spoken_response = response_data["spoken_text"]
        intent = response_data["intent"]
        logger.info(f"[Exotel Turn] Grama Mitra responding: '{spoken_response}'")

        # 3 & 4. Synthesize TTS and Stream to Exotel
        await self.send_spoken_response(session, spoken_response, websocket)

        latency_ms = (time.time() - t0) * 1000
        session.record_turn(farmer_text, spoken_response, intent, latency_ms)
        session.state = SessionState.LISTENING

    async def send_spoken_response(
        self, session, text: str, websocket, is_greeting: bool = False
    ):
        """
        Synthesizes text and streams 100ms PCM chunks with pacing over the WebSocket.
        """
        session.is_speaking = True
        session.interrupted = False

        # Synthesize Tamil TTS PCM audio
        pcm_audio = await tts_service.synthesize(
            text=text,
            language="ta-IN",
            target_sample_rate=self.config.sample_rate,
        )

        if not pcm_audio:
            session.is_speaking = False
            return

        # Split into 100ms frames (multiples of 320 bytes)
        chunks = telephony_audio_service.chunk_audio(pcm_audio)
        chunk_interval = self.config.chunk_size_ms / 1000.0  # 0.1s

        logger.info(f"[Exotel Stream] Streaming {len(chunks)} audio chunks ({len(pcm_audio)} bytes) to {session.stream_sid}")

        for i, chunk in enumerate(chunks):
            # Check for interruption
            if session.interrupted:
                logger.info(f"[Exotel Stream] Stream playback aborted due to interruption on chunk {i}/{len(chunks)}")
                break

            media_json = self.create_media_event(session.stream_sid, chunk)
            await websocket.send_text(media_json)
            # Paced pacing to mimic real-time telco stream rate
            await asyncio.sleep(chunk_interval * 0.85)

        session.is_speaking = False

    async def handle_stop_event(self, data: dict):
        """Handles Exotel 'stop' event when the call disconnects."""
        stream_sid = data.get("stream_sid", "")
        session = voice_session_manager.remove_session(stream_sid)
        if session:
            logger.info(
                f"[Exotel] Call ended — Stream: {stream_sid}, Total turns: {len(session.turns)}"
            )


# Singleton instance
exotel_service = ExotelService()

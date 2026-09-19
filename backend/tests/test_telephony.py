"""
Unit & Integration Tests for Grama Mitra Telephony Module.
Covers:
1. Exotel event parsing (start, media, clear, stop)
2. Audio conversion & PCM base64 encoding/decoding
3. Voice activity detection (VAD) energy calculation
4. Voice session manager lifecycle & telemetry
5. Telephony prompt formatting & emergency 108 detection
6. End-to-end mock test call pipeline
"""

import sys
import json
import pytest
from pathlib import Path

# Add backend directory to sys.path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from config.telephony_config import TelephonyConfig
from services.telephony_audio_service import TelephonyAudioService
from services.voice_session_manager import VoiceSessionManager, SessionState
from services.exotel_service import ExotelService
from services.telephony_prompt_service import TelephonyPromptService
from services.stt_service import SpeechToTextService
from services.tts_service import TextToSpeechService


@pytest.fixture
def test_config():
    return TelephonyConfig(
        telephony_enabled=True,
        mock_mode=True,
        sample_rate=8000,
        chunk_size_ms=100,
    )


@pytest.fixture
def audio_service(test_config):
    return TelephonyAudioService(test_config)


@pytest.fixture
def session_manager(test_config):
    return VoiceSessionManager(test_config)


@pytest.fixture
def exotel_svc(test_config):
    return ExotelService(test_config)


@pytest.fixture
def prompt_svc(test_config):
    return TelephonyPromptService(test_config)


# ─── 1. AUDIO CONVERSION & CHUNKING TESTS ───

def test_audio_encoding_decoding(audio_service):
    raw_pcm = b"\x00\x01\x00\x02\x00\x03\x00\x04"
    encoded = audio_service.encode_media_payload(raw_pcm)
    assert isinstance(encoded, str)
    decoded = audio_service.decode_media_payload(encoded)
    assert decoded == raw_pcm


def test_rms_energy_silence_vs_tone(audio_service):
    silence = audio_service.generate_silence(duration_seconds=0.5, sample_rate=8000)
    rms_silence = audio_service.calculate_rms_energy(silence)
    assert rms_silence == 0.0
    assert not audio_service.is_speech(silence, threshold=200)

    tone = audio_service.generate_synthetic_tone(
        duration_seconds=0.5, frequency=500.0, sample_rate=8000, amplitude=0.5
    )
    rms_tone = audio_service.calculate_rms_energy(tone)
    assert rms_tone > 1000.0
    assert audio_service.is_speech(tone, threshold=200)


def test_audio_chunking_alignment(audio_service):
    # 1 second of 8kHz 16-bit mono = 16000 bytes
    pcm_audio = audio_service.generate_synthetic_tone(duration_seconds=1.0, sample_rate=8000)
    assert len(pcm_audio) == 16000

    chunks = audio_service.chunk_audio(pcm_audio, chunk_size=1600)
    assert len(chunks) == 10
    for chunk in chunks:
        # Each chunk must be a multiple of 320 bytes for Exotel compatibility
        assert len(chunk) % 320 == 0


# ─── 2. EXOTEL EVENT SERIALIZATION & PARSING TESTS ───

def test_exotel_media_event_creation(exotel_svc):
    stream_sid = "test-stream-123"
    pcm_chunk = b"\x00" * 320
    event_json = exotel_svc.create_media_event(stream_sid, pcm_chunk)
    parsed = json.loads(event_json)

    assert parsed["event"] == "media"
    assert parsed["stream_sid"] == stream_sid
    assert "payload" in parsed["media"]


def test_exotel_clear_event_creation(exotel_svc):
    stream_sid = "test-stream-456"
    event_json = exotel_svc.create_clear_event(stream_sid)
    parsed = json.loads(event_json)

    assert parsed["event"] == "clear"
    assert parsed["stream_sid"] == stream_sid


def test_exotel_inbound_message_parsing(exotel_svc):
    valid_raw = json.dumps({"event": "start", "stream_sid": "stream-999", "start": {"call_sid": "call-1"}})
    res = exotel_svc.parse_inbound_message(valid_raw)
    assert res["event"] == "start"
    assert res["stream_sid"] == "stream-999"

    invalid_raw = "NOT_JSON"
    assert exotel_svc.parse_inbound_message(invalid_raw) is None


# ─── 3. VOICE SESSION MANAGER LIFECYCLE TESTS ───

def test_session_lifecycle(session_manager):
    stream_sid = "stream-live-101"
    session = session_manager.create_session(
        stream_sid=stream_sid,
        call_sid="call-live-101",
        account_sid="exotel-acc-1",
        caller_phone="+919876543210",
    )
    assert session.state == SessionState.INIT
    assert session.caller_phone == "+919876543210"
    assert session_manager.get_session(stream_sid) is session

    # Add audio
    session.append_inbound_audio(b"\x01\x02\x03\x04")
    assert len(session.inbound_audio_buffer) == 4

    retrieved = session.get_and_clear_inbound_audio()
    assert retrieved == b"\x01\x02\x03\x04"
    assert len(session.inbound_audio_buffer) == 0

    # Record turn
    session.record_turn("கேள்வி", "பதில்", "AGRICULTURE", 120.0)
    assert len(session.turns) == 1

    # End session
    closed = session_manager.remove_session(stream_sid)
    assert closed.state == SessionState.ENDED
    assert session_manager.get_session(stream_sid) is None


def test_telemetry_reporting(session_manager):
    session_manager.create_session("stream-tel-1")
    session_manager.log_error("stream-tel-1", "Test error for telemetry")
    stats = session_manager.get_telemetry_stats()

    assert stats["total_test_sessions"] >= 1
    assert stats["websocket_endpoint"] == "/ws/exotel/voice"
    assert len(stats["recent_errors"]) >= 1


# ─── 4. TELEPHONY PROMPT & EMERGENCY SAFETY TESTS ───

def test_clean_text_for_speech(prompt_svc):
    markdown_text = "🌾 **பயிர் பாதுகாப்பு:** ஏக்கருக்கு *10 கிலோ* யூரியா இடவும். [லிங்க்](https://tnau.ac.in)"
    cleaned = prompt_svc.clean_text_for_speech(markdown_text)
    assert "**" not in cleaned
    assert "*" not in cleaned
    assert "https" not in cleaned
    assert "ஏக்கருக்கு 10 கிலோ யூரியா இடவும்" in cleaned


@pytest.mark.asyncio
async def test_emergency_safety_escalation(prompt_svc):
    emergency_call = "எனக்கு நெஞ்சு வலி மற்றும் மூச்சுத்திணறல் அதிகமாக உள்ளது"
    res = await prompt_svc.generate_telephony_response(emergency_call)

    assert res["is_emergency"] is True
    assert res["intent"] == "EMERGENCY"
    assert "108" in res["spoken_text"]


@pytest.mark.asyncio
async def test_agriculture_response_generation(prompt_svc):
    agri_call = "நெல் இலை மஞ்சளாக மாறுகிறது என்ன மருந்து அடிக்க வேண்டும்?"
    res = await prompt_svc.generate_telephony_response(agri_call)

    assert res["is_emergency"] is False
    assert res["intent"] == "AGRICULTURE"
    assert len(res["spoken_text"]) > 10
    # Ensure text has no raw markdown asterisks
    assert "*" not in res["spoken_text"]


# ─── 5. FULL END-TO-END MOCK PIPELINE TEST ───

@pytest.mark.asyncio
async def test_end_to_end_mock_pipeline(audio_service, prompt_svc, test_config):
    # 1. Caller PCM audio
    sample_rate = test_config.sample_rate
    caller_pcm = audio_service.generate_synthetic_tone(duration_seconds=1.0, sample_rate=sample_rate)

    # 2. Transcribe
    stt = SpeechToTextService(test_config)
    tamil_query = await stt.transcribe(
        audio_pcm=caller_pcm,
        sample_rate=sample_rate,
        mock_override_text="PM-KISAN திட்டத்தில் எப்படி பதிவு செய்வது?",
    )
    assert "PM-KISAN" in tamil_query

    # 3. AI Turn
    turn = await prompt_svc.generate_telephony_response(tamil_query)
    assert turn["intent"] == "GOVERNMENT_SCHEME"
    assert len(turn["spoken_text"]) > 0

    # 4. Synthesize to Exotel PCM
    tts = TextToSpeechService(test_config)
    bot_pcm = await tts.synthesize(turn["spoken_text"], target_sample_rate=sample_rate)
    assert len(bot_pcm) > 0

    # 5. Chunking for Exotel stream
    chunks = audio_service.chunk_audio(bot_pcm)
    assert len(chunks) > 0
    for c in chunks:
        assert len(c) % 320 == 0

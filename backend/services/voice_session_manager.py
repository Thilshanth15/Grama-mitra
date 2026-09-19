"""
Voice Session Manager for Grama Mitra Telephony.
Tracks active Exotel phone call streams, audio buffers, conversation turns,
barge-in / interruption flags, and telemetry metrics.
"""

import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from config.telephony_config import telephony_config


class SessionState(str, Enum):
    INIT = "INIT"
    GREETING = "GREETING"
    LISTENING = "LISTENING"
    PROCESSING = "PROCESSING"
    SPEAKING = "SPEAKING"
    ENDED = "ENDED"


@dataclass
class VoiceCallSession:
    stream_sid: str
    call_sid: str = ""
    account_sid: str = ""
    caller_phone: str = ""
    state: SessionState = SessionState.INIT

    # Audio Buffers
    inbound_audio_buffer: bytearray = field(default_factory=bytearray)
    outbound_audio_chunks: List[bytes] = field(default_factory=list)

    # Voice Activity / Silence Tracking
    last_speech_time: float = field(default_factory=time.time)
    speech_detected_in_turn: bool = False
    turn_start_time: float = field(default_factory=time.time)

    # Conversation History
    turns: List[dict] = field(default_factory=list)
    started_at: datetime = field(default_factory=datetime.utcnow)
    last_activity_at: datetime = field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None

    # Flags
    is_speaking: bool = False
    interrupted: bool = False

    def append_inbound_audio(self, pcm_chunk: bytes):
        """Appends incoming audio chunk to the turn buffer."""
        self.inbound_audio_buffer.extend(pcm_chunk)
        self.last_activity_at = datetime.utcnow()

    def get_and_clear_inbound_audio(self) -> bytes:
        """Retrieves and clears the accumulated inbound audio for speech recognition."""
        audio = bytes(self.inbound_audio_buffer)
        self.inbound_audio_buffer.clear()
        self.speech_detected_in_turn = False
        return audio

    def record_turn(self, user_text: str, ai_text: str, intent: str, latency_ms: float):
        """Records a completed question/answer turn."""
        self.turns.append(
            {
                "user": user_text,
                "ai": ai_text,
                "intent": intent,
                "latency_ms": latency_ms,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
        self.last_activity_at = datetime.utcnow()


class VoiceSessionManager:
    def __init__(self, config=telephony_config):
        self.config = config
        self.active_sessions: Dict[str, VoiceCallSession] = {}
        
        # Telemetry & Operational Metrics (for Admin UI)
        self.total_sessions_count: int = 0
        self.total_turns_count: int = 0
        self.last_connection_time: Optional[str] = None
        self.recent_errors: List[dict] = []

    def create_session(
        self,
        stream_sid: str,
        call_sid: str = "",
        account_sid: str = "",
        caller_phone: str = "",
    ) -> VoiceCallSession:
        """Initializes and registers a new active telephony session."""
        session = VoiceCallSession(
            stream_sid=stream_sid,
            call_sid=call_sid,
            account_sid=account_sid,
            caller_phone=caller_phone,
        )
        self.active_sessions[stream_sid] = session
        self.total_sessions_count += 1
        self.last_connection_time = datetime.utcnow().isoformat()
        return session

    def get_session(self, stream_sid: str) -> Optional[VoiceCallSession]:
        """Retrieves an active session by stream SID."""
        return self.active_sessions.get(stream_sid)

    def remove_session(self, stream_sid: str) -> Optional[VoiceCallSession]:
        """Closes and cleans up a session."""
        session = self.active_sessions.pop(stream_sid, None)
        if session:
            session.state = SessionState.ENDED
            session.ended_at = datetime.utcnow()
        return session

    def log_error(self, stream_sid: str, error_message: str):
        """Records a sanitized diagnostic error log for the admin dashboard."""
        self.recent_errors.append(
            {
                "stream_sid": stream_sid[-8:] if stream_sid else "UNKNOWN",  # Sanitize
                "message": error_message,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
        # Keep only the 20 most recent errors
        if len(self.recent_errors) > 20:
            self.recent_errors.pop(0)

    def get_telemetry_stats(self) -> dict:
        """Returns live statistics for the Admin UI."""
        return {
            "telephony_enabled": self.config.telephony_enabled,
            "mock_mode": self.config.mock_mode,
            "active_calls": len(self.active_sessions),
            "total_test_sessions": self.total_sessions_count,
            "last_connection_time": self.last_connection_time,
            "websocket_endpoint": "/ws/exotel/voice",
            "recent_errors": self.recent_errors[-5:],
        }


# Singleton instance
voice_session_manager = VoiceSessionManager()

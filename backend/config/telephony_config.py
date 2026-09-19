"""
Telephony Configuration Module for Grama Mitra
Loads Exotel AgentStream / Voicebot settings and audio streaming parameters from environment.
"""

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class TelephonyConfig:
    # Exotel Account & Auth
    account_sid: str = os.getenv("EXOTEL_ACCOUNT_SID", "")
    api_key: str = os.getenv("EXOTEL_API_KEY", "")
    api_token: str = os.getenv("EXOTEL_API_TOKEN", "")
    phone_number: str = os.getenv("EXOTEL_PHONE_NUMBER", "+918000000000")
    webhook_url: str = os.getenv("EXOTEL_WEBHOOK_URL", "")
    websocket_url: str = os.getenv("EXOTEL_WEBSOCKET_URL", "wss://localhost:8000/ws/exotel/voice")

    # Mode & Feature Flags
    telephony_enabled: bool = os.getenv("TELEPHONY_ENABLED", "false").lower() == "true"
    mock_mode: bool = os.getenv("TELEPHONY_MOCK_MODE", "true").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    # Audio Stream Specifications (Exotel Voicebot / AgentStream standard)
    sample_rate: int = int(os.getenv("TELEPHONY_SAMPLE_RATE", "8000"))  # 8000 Hz or 16000 Hz
    channels: int = 1  # Mono
    bytes_per_sample: int = 2  # 16-bit linear PCM
    chunk_size_ms: int = int(os.getenv("TELEPHONY_CHUNK_SIZE_MS", "100"))  # 100ms standard

    # Voice Activity & Silence Detection
    silence_threshold_energy: int = int(os.getenv("VAD_ENERGY_THRESHOLD", "350"))
    silence_duration_seconds: float = float(os.getenv("VAD_SILENCE_DURATION", "1.1"))
    max_speech_duration_seconds: float = float(os.getenv("VAD_MAX_SPEECH_DURATION", "15.0"))

    # Welcome Prompt in Spoken Rural Tamil
    welcome_message_tamil: str = (
        "வணக்கம்! நான் கிராம மித்ரா. உங்கள் விவசாயம், அரசு திட்டங்கள் மற்றும் "
        "பொதுவான உதவிக்கு நான் உதவுவேன். உங்களுக்கு என்ன உதவி வேண்டும்?"
    )

    unclear_speech_prompt_tamil: str = (
        "மன்னிக்கவும், உங்கள் குரல் தெளிவாக கேட்கவில்லை. தயவுசெய்து உங்கள் கேள்வியை மீண்டும் சொல்ல முடியுமா?"
    )

    error_fallback_tamil: str = (
        "மன்னிக்கவும், தொழில்நுட்ப கோளாறு காரணமாக பதிலளிக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் அழைக்கவும்."
    )

    @property
    def bytes_per_chunk(self) -> int:
        """
        Calculates chunk size in bytes for the specified sample rate and duration.
        For 8000 Hz, 16-bit mono, 100ms = 8000 * 2 * 0.1 = 1600 bytes (multiple of 320).
        """
        raw_bytes = int(self.sample_rate * self.bytes_per_sample * (self.chunk_size_ms / 1000.0))
        # Ensure it is a clean multiple of 320 bytes per Exotel chunk specification
        remainder = raw_bytes % 320
        return raw_bytes if remainder == 0 else raw_bytes + (320 - remainder)


# Singleton instance
telephony_config = TelephonyConfig()

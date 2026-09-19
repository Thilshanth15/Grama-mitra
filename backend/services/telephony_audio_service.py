"""
Telephony Audio Processing Service for Grama Mitra.
Handles base64 decoding/encoding, audio frame chunking, energy-based Voice Activity Detection (VAD),
and synthetic PCM generation for testing.
"""

import base64
import math
import struct
from typing import List, Tuple
from config.telephony_config import telephony_config


class TelephonyAudioService:
    def __init__(self, config=telephony_config):
        self.config = config

    def decode_media_payload(self, base64_payload: str) -> bytes:
        """Decodes base64-encoded raw PCM audio received from Exotel."""
        try:
            return base64.b64decode(base64_payload)
        except Exception as e:
            return b""

    def encode_media_payload(self, pcm_bytes: bytes) -> str:
        """Encodes raw PCM audio bytes to base64 for transmission to Exotel."""
        return base64.b64encode(pcm_bytes).decode("utf-8")

    def calculate_rms_energy(self, pcm_bytes: bytes) -> float:
        """
        Calculates Root Mean Square (RMS) energy of 16-bit linear PCM audio.
        Used for silence / speech presence detection.
        """
        if not pcm_bytes or len(pcm_bytes) < 2:
            return 0.0

        num_samples = len(pcm_bytes) // 2
        fmt = f"<{num_samples}h"  # 16-bit little-endian signed short
        try:
            samples = struct.unpack(fmt, pcm_bytes[: num_samples * 2])
            sum_squares = sum(sample * sample for sample in samples)
            return math.sqrt(sum_squares / num_samples)
        except Exception:
            return 0.0

    def is_speech(self, pcm_bytes: bytes, threshold: int = None) -> bool:
        """Returns True if the audio energy exceeds the speech detection threshold."""
        t = threshold if threshold is not None else self.config.silence_threshold_energy
        return self.calculate_rms_energy(pcm_bytes) > t

    def chunk_audio(self, pcm_bytes: bytes, chunk_size: int = None) -> List[bytes]:
        """
        Splits a continuous PCM audio buffer into uniform chunks (multiples of 320 bytes, ~100ms)
        as required by Exotel bidirectional streaming.
        """
        size = chunk_size or self.config.bytes_per_chunk
        chunks = []
        total_len = len(pcm_bytes)

        for i in range(0, total_len, size):
            chunk = pcm_bytes[i : i + size]
            # Pad the final chunk if necessary to maintain exact alignment
            if len(chunk) < size:
                remainder = len(chunk) % 320
                if remainder != 0:
                    pad_len = 320 - remainder
                    chunk = chunk + (b"\x00" * pad_len)
            chunks.append(chunk)

        return chunks

    def generate_synthetic_tone(
        self,
        duration_seconds: float = 1.0,
        frequency: float = 440.0,
        sample_rate: int = 8000,
        amplitude: float = 0.3,
    ) -> bytes:
        """
        Generates clean 16-bit mono linear PCM sine wave audio for mock testing and verification.
        """
        num_samples = int(duration_seconds * sample_rate)
        pcm_data = bytearray()

        for i in range(num_samples):
            # Generate sine sample
            val = amplitude * math.sin(2.0 * math.pi * frequency * (i / sample_rate))
            sample_val = int(val * 32767.0)
            sample_val = max(-32768, min(32767, sample_val))
            pcm_data.extend(struct.pack("<h", sample_val))

        return bytes(pcm_data)

    def generate_silence(self, duration_seconds: float = 0.5, sample_rate: int = 8000) -> bytes:
        """Generates zero-energy PCM silence bytes."""
        num_samples = int(duration_seconds * sample_rate)
        return bytes(num_samples * 2)


# Singleton instance
telephony_audio_service = TelephonyAudioService()

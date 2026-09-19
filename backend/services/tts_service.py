"""
Text-to-Speech (TTS) Service for Telephony in Grama Mitra.
Converts Tamil AI responses into 16-bit mono linear PCM audio at 8kHz / 16kHz for Exotel streaming.
Supports live cloud TTS engines and synthetic audio generation for mock mode testing.
"""

import os
import logging
from config.telephony_config import telephony_config
from services.telephony_audio_service import telephony_audio_service

logger = logging.getLogger("grama_mitra.tts")


class TextToSpeechService:
    def __init__(self, config=telephony_config):
        self.config = config
        self.api_key = os.getenv("TTS_API_KEY", "")

    async def synthesize(
        self,
        text: str,
        language: str = "ta-IN",
        target_sample_rate: int = None,
    ) -> bytes:
        """
        Synthesizes Tamil text into raw 16-bit linear PCM audio.

        :param text: Text string to speak (Tamil).
        :param language: Language code (ta-IN).
        :param target_sample_rate: 8000 or 16000 Hz.
        :return: Raw 16-bit mono linear PCM audio bytes.
        """
        sample_rate = target_sample_rate or self.config.sample_rate

        if not text or not text.strip():
            return b""

        # In mock mode or when no cloud TTS key is supplied, generate synthetic PCM audio
        if self.config.mock_mode or not self.api_key:
            # Estimate spoken duration based on text length (~15 characters per second)
            estimated_duration = max(1.2, min(8.0, len(text) / 14.0))
            logger.info(
                f"[TTS Mock] Synthesizing '{text[:40]}...' into {estimated_duration:.2f}s of {sample_rate}Hz PCM"
            )
            return telephony_audio_service.generate_synthetic_tone(
                duration_seconds=estimated_duration,
                frequency=480.0,
                sample_rate=sample_rate,
                amplitude=0.35,
            )

        # Live Cloud TTS Engine (e.g. Google Cloud Text-to-Speech)
        try:
            from google.cloud import texttospeech

            client = texttospeech.TextToSpeechClient()
            synthesis_input = texttospeech.SynthesisInput(text=text)

            voice = texttospeech.VoiceSelectionParams(
                language_code=language,
                name="ta-IN-Wavenet-A",  # Natural Tamil voice
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.LINEAR16,
                sample_rate_hertz=sample_rate,
                speaking_rate=0.92,  # Slightly slower for clear rural phone comprehension
            )

            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )
            # Skip 44-byte WAV header if returned to get raw PCM data
            audio_content = response.audio_content
            if audio_content.startswith(b"RIFF"):
                return audio_content[44:]
            return audio_content

        except ImportError:
            logger.warning("google-cloud-texttospeech not installed. Falling back to synthetic tone.")
            return telephony_audio_service.generate_synthetic_tone(
                duration_seconds=2.0,
                frequency=480.0,
                sample_rate=sample_rate,
            )
        except Exception as e:
            logger.error(f"Cloud TTS synthesis error: {e}")
            return telephony_audio_service.generate_synthetic_tone(
                duration_seconds=1.5,
                frequency=480.0,
                sample_rate=sample_rate,
            )


# Singleton instance
tts_service = TextToSpeechService()

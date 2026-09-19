"""
Speech-to-Text (STT) Service for Telephony in Grama Mitra.
Transcribes incoming telephone PCM audio into Tamil text.
Supports live cloud engines (Google Cloud STT / Whisper) and simulated mock mode for local testing.
"""

import os
import logging
from config.telephony_config import telephony_config

logger = logging.getLogger("grama_mitra.stt")

# Simulated realistic farmer queries for mock telephony testing
MOCK_FARMER_QUERIES = [
    "நெல் பயிரில் இலைகள் மஞ்சளாக மாறுகிறது என்ன மருந்து அடிக்க வேண்டும்?",
    "PM-KISAN தவணை பணம் இன்னும் வரவில்லை, எப்படி சரிபார்க்க வேண்டும்?",
    "நெல் பயிரில் பூச்சி தாக்குதல் உள்ளது, இயற்கை முறையில் எப்படி கட்டுப்படுத்துவது?",
    "எனக்கு நெஞ்சு வலி மற்றும் மூச்சுத்திணறல் அதிகமாக உள்ளது உதவி செய்யுங்கள்",
    "கால்நடைகளுக்கு கோமாரி நோய் தடுப்பூசி எப்போது போட வேண்டும்?",
]


class SpeechToTextService:
    def __init__(self, config=telephony_config):
        self.config = config
        self.api_key = os.getenv("STT_API_KEY", "")
        self.mock_index = 0

    async def transcribe(
        self,
        audio_pcm: bytes,
        sample_rate: int = 8000,
        language: str = "ta-IN",
        mock_override_text: str = None,
    ) -> str:
        """
        Transcribes raw linear PCM audio into Tamil text.
        
        :param audio_pcm: 16-bit linear PCM audio bytes.
        :param sample_rate: Sample rate (8000 or 16000).
        :param language: Language code (ta-IN for Tamil).
        :param mock_override_text: Specific test string to return in mock mode.
        :return: Transcribed text string in Tamil.
        """
        if not audio_pcm or len(audio_pcm) < 100:
            return ""

        # Use mock response if mock mode is active or STT API key is absent
        if self.config.mock_mode or not self.api_key:
            if mock_override_text:
                return mock_override_text

            query = MOCK_FARMER_QUERIES[self.mock_index % len(MOCK_FARMER_QUERIES)]
            self.mock_index += 1
            logger.info(f"[STT Mock] Transcribed {len(audio_pcm)} bytes PCM -> '{query}'")
            return query

        # Live Cloud STT Engine Integration (e.g. Google Cloud Speech-to-Text)
        try:
            # If google-cloud-speech is available in environment
            from google.cloud import speech_v1p1beta1 as speech

            client = speech.SpeechClient()
            audio = speech.RecognitionAudio(content=audio_pcm)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=sample_rate,
                language_code=language,
                enable_automatic_punctuation=True,
            )

            response = client.recognize(config=config, audio=audio)
            transcripts = [result.alternatives[0].transcript for result in response.results]
            return " ".join(transcripts).strip()

        except ImportError:
            logger.warning("google-cloud-speech library not installed. Falling back to mock STT.")
            query = MOCK_FARMER_QUERIES[self.mock_index % len(MOCK_FARMER_QUERIES)]
            self.mock_index += 1
            return query
        except Exception as e:
            logger.error(f"Cloud STT API error: {e}")
            return ""


# Singleton instance
stt_service = SpeechToTextService()

"""
Telephony Prompt & Dialogue Service for Grama Mitra.
Adapts Gemini AI responses for oral phone conversations in rural Tamil.
Ensures short, spoken, punctuation-clean sentences suitable for phone lines without markdown.
"""

import re
from typing import Optional
from app.safety.safety_service import detect_emergency, classify_risk
from app.ai.ai_service import generate_response, classify_intent
from config.telephony_config import telephony_config

TELEPHONY_SYSTEM_PROMPT = """You are Grama Mitra, speaking to a rural farmer in Tamil over a telephone call.

TELEPHONE VOICE RULES:
1. Speak in natural, colloquial spoken Tamil (பேச்சுத் தமிழ்) that a village farmer easily understands.
2. Keep your answer VERY SHORT: 1 to 2 sentences only (maximum 30 words).
3. Do NOT use markdown symbols, asterisks, bullet points, numbering, or web URLs.
4. For agriculture: Give 1 direct practical remedy or instruction.
5. For government schemes: State the core eligibility or benefit in 1 sentence.
6. For health: Give basic awareness only. Never prescribe medicines or diagnose.
7. If it sounds like a medical emergency, say to call 108 immediately.
8. End with a short helpful question like "வேறு ஏதேனும் தகவல் வேண்டுமா?" (Do you need anything else?).
"""


class TelephonyPromptService:
    def __init__(self, config=telephony_config):
        self.config = config

    def clean_text_for_speech(self, text: str) -> str:
        """
        Removes markdown formatting, asterisks, bullet points, URLs, and excessive whitespace
        so that TTS produces natural spoken Tamil speech.
        """
        if not text:
            return ""

        # Remove markdown bold/italics
        cleaned = re.sub(r"\*+", "", text)
        # Remove URLs
        cleaned = re.sub(r"https?://\S+", "", cleaned)
        # Remove bullet markers
        cleaned = re.sub(r"^[\s\-\*\•\d\.]+", "", cleaned, flags=re.MULTILINE)
        # Remove markdown headers
        cleaned = re.sub(r"#+\s*", "", cleaned)
        # Remove emojis (optional, standard TTS handles some or ignores them)
        cleaned = re.sub(r"[🚨⚠️🌾🏛️🏥🔍📊📝]", "", cleaned)
        # Collapse multi-newlines and spaces
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        return cleaned

    async def generate_telephony_response(
        self,
        farmer_speech: str,
        session_context: Optional[dict] = None,
    ) -> dict:
        """
        Generates an AI response tailored for telephone audio playback.
        
        :param farmer_speech: Recognized text from farmer's speech.
        :param session_context: Caller metadata and history.
        :return: Dict with spoken_text, intent, is_emergency, and confidence.
        """
        if not farmer_speech or not farmer_speech.strip():
            return {
                "spoken_text": self.config.unclear_speech_prompt_tamil,
                "intent": "UNKNOWN",
                "is_emergency": False,
                "confidence": 0.0,
            }

        # Step 1: Emergency Check
        if detect_emergency(farmer_speech):
            emergency_spoken = (
                "இது ஒரு மருத்துவ அவசர நிலை. உடனடியாக 108 ஆம்புலன்ஸ் எண்ணை அழையுங்கள். "
                "அமைதியாக இருங்கள், கதவை திறந்து வையுங்கள்."
            )
            return {
                "spoken_text": emergency_spoken,
                "intent": "EMERGENCY",
                "is_emergency": True,
                "confidence": 1.0,
            }

        # Step 2: Intent Classification
        intent = classify_intent(farmer_speech)

        # Context snippet matching the intent
        context_snippets = {
            "AGRICULTURE": "நெல் இலை மஞ்சள் நோய்க்கு ஏக்கருக்கு 10-15 கிலோ யூரியா அல்லது வேப்பம்பிண்ணாக்கு இடவும். இலை கருகலுக்கு டிரைசைக்ளசோல் தெளிக்கவும்.",
            "GOVERNMENT_SCHEME": "PM-KISAN திட்டத்தில் ஆண்டுக்கு ஆறாயிரம் ரூபாய் மூன்று தவணைகளாக விவசாயிகளின் வங்கிக் கணக்கில் நேரடியாக வழங்கப்படுகிறது.",
            "HEALTH": "காய்ச்சல் அல்லது உடல் உபாதைகளுக்கு உடனடியாக ஆரம்ப சுகாதார நிலைய மருத்துவரை அணுகவும். சுய மருத்துவம் தவிர்க்கவும்.",
            "GENERAL": "விவசாயம், உரங்கள், பூச்சி மேலாண்மை மற்றும் அரசு நலத்திட்டங்கள் பற்றிய விவரங்களை நீங்கள் என்னிடம் கேட்கலாம்.",
        }
        context = context_snippets.get(intent, context_snippets["GENERAL"])

        # Step 3: Call AI Service
        try:
            ai_result = await generate_response(
                message=f"TELEPHONE CALL: {farmer_speech}",
                context=f"{TELEPHONY_SYSTEM_PROMPT}\n\nKNOWLEDGE: {context}",
                intent=intent,
            )
            raw_response = ai_result.get("response", "")
            spoken_text = self.clean_text_for_speech(raw_response)

            # Ensure response is not empty
            if not spoken_text:
                spoken_text = (
                    "உங்கள் கேள்வி புரிந்தது. விவசாய ஆலோசனை பெற உங்கள் பகுதி வேளாண்மை அலுவலரை "
                    "நேரடியாக தொடர்புகொள்ளவும்."
                )

            return {
                "spoken_text": spoken_text,
                "intent": intent,
                "is_emergency": False,
                "confidence": ai_result.get("confidence", 0.75),
            }

        except Exception as e:
            return {
                "spoken_text": self.config.error_fallback_tamil,
                "intent": intent,
                "is_emergency": False,
                "confidence": 0.2,
            }


# Singleton instance
telephony_prompt_service = TelephonyPromptService()

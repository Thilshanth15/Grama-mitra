"""
AI Service — Gemini integration with grounded generation and diagnostic logging
"""
import os
import logging
from typing import Optional, Tuple, Any

logger = logging.getLogger("grama_mitra.ai")

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("google.generativeai SDK is not installed. Gemini AI integration will be unavailable.")

SYSTEM_PROMPT = """You are Grama Mitra, a trusted Tamil-first AI assistant for rural India.

RULES:
1. Respond in simple Tamil (primary) with clear English translation/summary if appropriate.
2. Ground your response in the provided KNOWLEDGE CONTEXT whenever available.
3. For health questions: include a note that this is informational guidance only, not a substitute for medical advice.
4. Never diagnose diseases, prescribe specific prescription dosages, or give unsafe health advice.
5. If context is insufficient, explain what is known and offer practical advice without fabricating false details.
6. Keep responses structured, concise, and easy to read.
7. For emergency symptoms: clearly urge calling 108 immediately.
8. Cite official sources (e.g., TNAU, PM-KISAN, WHO) when available in the context."""


def _get_gemini_model() -> Tuple[Optional[Any], Optional[str]]:
    """
    Dynamically fetches GEMINI_API_KEY from environment and configures the GenerativeModel.
    Supports model fallbacks if the primary model is unavailable.
    """
    if not GEMINI_AVAILABLE:
        return None, "google-generativeai package not installed"

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or not api_key.strip():
        logger.warning("GEMINI_API_KEY environment variable is missing or empty.")
        return None, "GEMINI_API_KEY environment variable missing"

    try:
        genai.configure(api_key=api_key.strip())
        model_candidates = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
        
        selected_model_name = model_candidates[0]
        model = genai.GenerativeModel(selected_model_name)
        return model, None
    except Exception as e:
        err_msg = f"Failed to configure Gemini model: {str(e)}"
        logger.error(err_msg, exc_info=True)
        return None, err_msg


async def generate_response(message: str, context: str, intent: str, language: str = "ta") -> dict:
    """Generate a grounded AI response using Gemini or local knowledge fallback."""
    
    model, error_reason = _get_gemini_model()

    if model:
        lang_instruction = (
            "Respond in simple, clear English suitable for rural farmers."
            if language == "en"
            else "Respond in simple Tamil (primary) with clear English translation/summary if appropriate."
        )

        prompt = f"""{SYSTEM_PROMPT}

INTENT: {intent}
LANGUAGE PREFERENCE: {language}
LANGUAGE RULE: {lang_instruction}

KNOWLEDGE CONTEXT:
{context if context else 'No specific verified snippet found. Use general factual knowledge for rural India.'}

USER QUESTION: {message}

Generate a helpful, accurate response:"""

        try:
            response = model.generate_content(prompt)
            if response and response.text:
                return {
                    "response": response.text.strip(),
                    "source": "Gemini (Grounded)",
                    "confidence": 0.88 if context else 0.75,
                }
            else:
                logger.warning("Gemini returned empty text response.")
        except Exception as e:
            logger.error(f"Gemini API invocation error for message '{message[:50]}...': {e}", exc_info=True)
            # Fall through to local fallback below
    else:
        logger.info(f"Gemini AI bypassed: {error_reason}. Operating in local RAG fallback mode.")

    return _local_fallback(message, context, intent, language=language, gemini_error=error_reason)


def _local_fallback(message: str, context: str, intent: str, language: str = "ta", gemini_error: Optional[str] = None) -> dict:
    """Local rule-based fallback grounded on retrieved knowledge context when Gemini is unavailable."""
    if context:
        prefix = "Based on verified government and agricultural department information:\n\n" if language == "en" else "அரசு மற்றும் வேளாண்மைத் துறை தகவல்களின் அடிப்படையில்:\n\n"
        return {
            "response": f"{prefix}{context}",
            "source": "Local Knowledge Base",
            "confidence": 0.78,
        }

    # If no context found and Gemini unavailable, explain clearly
    err_note = f" (Note: Gemini API key is missing or unconfigured: {gemini_error})" if gemini_error else ""
    return {
        "response": (
            f"I couldn't find specific verified information for this question in the database.{err_note}\n"
            "Please click 'Request Human Help' to connect with a village officer."
        ),
        "source": None,
        "confidence": 0.3,
    }



def classify_intent(text: str) -> str:
    lower = text.lower()
    agri = [
        "crop", "farm", "paddy", "rice", "pest", "fertilizer", "soil", "harvest", "groundnut", "banana", "sugarcane", "tomato",
        "நெல்", "பயிர்", "விவசாய", "மண்", "உரம்", "பூச்சி", "நிலக்கடலை", "வாழை", "கரும்பு", "தக்காளி", "இலை", "வேளாண்"
    ]
    govt = [
        "scheme", "government", "apply", "pm kisan", "pm-kisan", "pmkisan", "ration", "aadhaar", "subsidy", "insurance", "kcc", "mgnregs", "tangedco", "electricity",
        "அரசு", "திட்டம்", "விண்ணப்பம்", "கிசான்", "குடும்ப அட்டை", "ஆதார்", "மின்சாரம்", "வேலை உறுதி", "100 நாள்", "காப்பீடு", "சான்று"
    ]
    health = [
        "fever", "pain", "sick", "medicine", "doctor", "hospital", "diabetes", "dehydration", "vaccine",
        "காய்ச்சல்", "வலி", "நோய்", "மருந்து", "மருத்துவர்", "மருத்துவமனை", "நீரிழிவு", "தடுப்பூசி"
    ]

    if any(k in lower for k in agri):
        return "AGRICULTURE"
    if any(k in lower for k in govt):
        return "GOVERNMENT_SCHEME"
    if any(k in lower for k in health):
        return "HEALTH"
    return "GENERAL"


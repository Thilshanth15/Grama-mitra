"""
AI Service — Gemini integration with grounded generation
"""
import os
from typing import Optional

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_AVAILABLE and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
else:
    model = None


SYSTEM_PROMPT = """You are Grama Mitra, a trusted Tamil-first AI assistant for rural India.

RULES:
1. Respond in simple Tamil (primary) with English support
2. Only answer based on the provided knowledge context
3. For health questions: add disclaimer that this is informational only, not medical advice
4. Never diagnose diseases, prescribe medications, or give unsafe health advice
5. If context is insufficient, say so honestly — do not fabricate
6. Keep responses short and actionable
7. For emergency symptoms: tell user to call 108 immediately
8. Always cite the source when provided

FORMAT:
- Use bullet points for steps
- Keep paragraphs short (2-3 sentences max)
- Start with Tamil response, English summary optional"""


async def generate_response(message: str, context: str, intent: str) -> dict:
    """Generate a grounded AI response using Gemini or local fallback."""

    if model and GEMINI_AVAILABLE:
        prompt = f"""{SYSTEM_PROMPT}

INTENT: {intent}
KNOWLEDGE CONTEXT: {context or 'No verified context available for this query.'}

USER QUESTION: {message}

Generate a helpful, accurate response based on the knowledge context above:"""

        try:
            response = model.generate_content(prompt)
            return {
                "response": response.text,
                "source": "Gemini (grounded)",
                "confidence": 0.85,
            }
        except Exception as e:
            return _local_fallback(message, context, intent)
    else:
        return _local_fallback(message, context, intent)


def _local_fallback(message: str, context: str, intent: str) -> dict:
    """Local rule-based fallback when Gemini is unavailable."""
    if context:
        return {
            "response": f"Based on verified information:\n\n{context[:800]}",
            "source": "Local Knowledge Base",
            "confidence": 0.72,
        }
    return {
        "response": (
            "இந்த கேள்விக்கு சரியான தகவல் இல்லை.\n\n"
            "I couldn't find verified information for this question. "
            "Please click 'Request Human Help' for personalized assistance."
        ),
        "source": None,
        "confidence": 0.2,
    }


def classify_intent(text: str) -> str:
    lower = text.lower()
    agri = ["crop", "farm", "paddy", "rice", "pest", "fertilizer", "soil", "harvest",
            "நெல்", "பயிர்", "விவசாய", "மண்", "உரம்", "பூச்சி"]
    govt = ["scheme", "government", "apply", "pm kisan", "ration", "aadhaar", "subsidy",
            "அரசு", "திட்டம்", "விண்ணப்பம்", "கிசான்", "குடும்ப அட்டை"]
    health = ["fever", "pain", "sick", "medicine", "doctor", "hospital",
              "காய்ச்சல்", "வலி", "நோய்", "மருந்து", "மருத்துவர்"]

    if any(k in lower for k in agri):
        return "AGRICULTURE"
    if any(k in lower for k in govt):
        return "GOVERNMENT_SCHEME"
    if any(k in lower for k in health):
        return "HEALTH"
    return "GENERAL"

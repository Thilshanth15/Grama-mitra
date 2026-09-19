from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.safety.safety_service import detect_emergency, classify_risk, EMERGENCY_RESPONSE_TAMIL
from app.ai.ai_service import generate_response, classify_intent

router = APIRouter()

KNOWLEDGE_SNIPPETS = {
    "AGRICULTURE": "நெல் இலைகள் மஞ்சளாவதற்கு நைட்ரஜன் குறைபாடு முக்கிய காரணம். ஏக்கருக்கு 10-15 கிலோ யூரியா இட்டு நீர் பாய்ச்சவும். (Source: TNAU)",
    "GOVERNMENT_SCHEME": "PM-KISAN திட்டம்: விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நேரடி வங்கி கணக்கில். pmkisan.gov.in இல் பதிவு செய்யவும். (Source: pmkisan.gov.in)",
    "HEALTH": "⚠️ இது தகவல் மட்டுமே. மருத்துவ ஆலோசனை அல்ல. காய்ச்சல் 38°C மேல் இருந்தால் மருத்துவரை சந்திக்கவும். (Source: WHO)",
}


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    is_emergency = detect_emergency(req.message)
    risk = classify_risk(req.message)

    if is_emergency:
        return ChatResponse(
            response=EMERGENCY_RESPONSE_TAMIL,
            confidence=1.0,
            intent="EMERGENCY",
            is_emergency=True,
            needs_handoff=True,
            confidence_label="Emergency Protocol",
        )

    intent = req.intent or classify_intent(req.message)
    context = KNOWLEDGE_SNIPPETS.get(intent, "")

    ai_result = await generate_response(req.message, context, intent)

    confidence = ai_result.get("confidence", 0.5)
    needs_handoff = confidence < 0.6

    return ChatResponse(
        response=ai_result["response"],
        confidence=confidence,
        intent=intent,
        is_emergency=False,
        needs_handoff=needs_handoff,
        confidence_label=(
            "High Confidence" if confidence >= 0.8
            else "Moderate" if confidence >= 0.6
            else "Needs Clarification"
        ),
        disclaimer="Health responses are informational only. Consult a doctor." if intent == "HEALTH" else None,
    )

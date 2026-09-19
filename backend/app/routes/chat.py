from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse, SourceModel
from app.safety.safety_service import detect_emergency, classify_risk, EMERGENCY_RESPONSE_TAMIL
from app.ai.ai_service import generate_response, classify_intent
from app.knowledge_base.knowledge_service import knowledge_service

router = APIRouter()


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
    
    # Retrieve RAG context from verified knowledge base
    context = knowledge_service.get_relevant_context(
        query=req.message,
        category=intent if intent in ["AGRICULTURE", "GOVERNMENT_SCHEME", "HEALTH"] else None,
        top_k=2,
    )

    ai_result = await generate_response(req.message, context, intent)

    confidence = ai_result.get("confidence", 0.5)
    needs_handoff = confidence < 0.6

    source_obj = None
    if ai_result.get("source"):
        source_obj = SourceModel(name=ai_result["source"])

    return ChatResponse(
        response=ai_result["response"],
        confidence=confidence,
        intent=intent,
        is_emergency=False,
        needs_handoff=needs_handoff,
        source=source_obj,
        confidence_label=(
            "High Confidence" if confidence >= 0.8
            else "Moderate" if confidence >= 0.6
            else "Needs Clarification"
        ),
        disclaimer="Health responses are informational only. Consult a doctor." if intent == "HEALTH" else None,
    )

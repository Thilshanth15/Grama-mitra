from fastapi import APIRouter
from app.models.schemas import HandoffRequest
router = APIRouter()

@router.post("/handoff")
async def create_handoff(req: HandoffRequest):
    return {"status": "created", "priority": req.priority, "reason": req.reason, "note": "Store in Firestore handoffs collection in production"}

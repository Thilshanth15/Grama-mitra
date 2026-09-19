from fastapi import APIRouter
router = APIRouter()

@router.get("/analytics")
async def get_analytics():
    """Admin analytics endpoint — connects to Firestore in production."""
    return {
        "total_queries": 0,
        "today_queries": 0,
        "pending_handoffs": 0,
        "health_alerts": 0,
        "category_distribution": {},
        "channel_distribution": {},
        "note": "Connect to Firestore for live data.",
    }

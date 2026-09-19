from fastapi import APIRouter, Query
router = APIRouter()

@router.get("/search")
async def search_knowledge(q: str = Query(..., description="Search query"), category: str = Query(None)):
    """Search knowledge base — returns matched FAQs."""
    return {"status": "ok", "query": q, "category": category, "results": [], "note": "Connect to Firestore or vector DB for production"}

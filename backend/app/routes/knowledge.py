from fastapi import APIRouter, Query
from app.knowledge_base.knowledge_service import knowledge_service

router = APIRouter()


@router.get("/search")
async def search_knowledge(
    q: str = Query(..., description="Search query"),
    category: str = Query(None, description="Category filter (AGRICULTURE, GOVERNMENT_SCHEME, HEALTH, GENERAL)"),
):
    """Search knowledge base — returns matched verified FAQs."""
    results = knowledge_service.search_knowledge(query=q, category=category, top_k=5)
    return {
        "status": "ok",
        "query": q,
        "category": category,
        "count": len(results),
        "results": results,
    }

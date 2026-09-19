"""
Unit & Integration Tests for Grama Mitra Chat API, Knowledge Service RAG, and AI Fallbacks
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.ai_service import classify_intent, generate_response
from app.knowledge_base.knowledge_service import knowledge_service

client = TestClient(app)


def test_knowledge_base_loaded():
    """Verify that knowledge records are loaded properly."""
    assert knowledge_service.count() > 0, "Knowledge base should not be empty"


def test_intent_classification():
    """Test Tamil and English intent classification."""
    assert classify_intent("நெல் இலை மஞ்சளாகிறது") == "AGRICULTURE"
    assert classify_intent("நிலக்கடலை பயிரிட காலம்") == "AGRICULTURE"
    assert classify_intent("PM-KISAN திட்டம்") == "GOVERNMENT_SCHEME"
    assert classify_intent("100 நாள் வேலை") == "GOVERNMENT_SCHEME"
    assert classify_intent("காய்ச்சல் மருந்து") == "HEALTH"
    assert classify_intent("வணக்கம்") == "GENERAL"


def test_knowledge_retrieval_tamil_agriculture():
    """Test knowledge retrieval for Tamil agriculture query."""
    query = "நெல் பயிரில் இலைகள் மஞ்சளாகிறது. என்ன காரணம்?"
    context = knowledge_service.get_relevant_context(query, category="AGRICULTURE")
    assert "நைட்ரஜன் குறைபாடு" in context or "யூரியா" in context
    assert len(context) > 0


def test_knowledge_retrieval_groundnut():
    """Test knowledge retrieval for groundnut question in Tamil."""
    query = "நிலக்கடலை பயிரிட சரியான நேரம் எது?"
    context = knowledge_service.get_relevant_context(query, category="AGRICULTURE")
    assert "நிலக்கடலை" in context
    assert "ஜனவரி" in context or "ஜூலை" in context


def test_chat_api_tamil_agriculture_query():
    """Test POST /api/chat with Tamil agriculture query."""
    payload = {
        "message": "நெல் பயிரில் இலைகள் மஞ்சளாகிறது. என்ன காரணம்?",
        "channel": "Website",
        "language": "ta"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "AGRICULTURE"
    assert data["is_emergency"] is False
    assert data["confidence"] >= 0.7  # Should have high confidence with RAG context
    assert data["needs_handoff"] is False
    assert len(data["response"]) > 0


def test_chat_api_government_scheme_query():
    """Test POST /api/chat with PM-KISAN query."""
    payload = {
        "message": "PM-KISAN திட்டம் பற்றி கூறுக",
        "channel": "Website"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "GOVERNMENT_SCHEME"
    assert data["confidence"] >= 0.7
    assert data["needs_handoff"] is False


def test_chat_api_emergency():
    """Test POST /api/chat with Emergency query."""
    payload = {
        "message": "எனக்கு திடீரென மார்பு வலி மற்றும் மூச்சுத்திணறல் வருகிறது",
        "channel": "Website"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "EMERGENCY"
    assert data["is_emergency"] is True
    assert data["needs_handoff"] is True
    assert data["confidence"] == 1.0
    assert "108" in data["response"]


def test_health_endpoint():
    """Test GET /api/health output."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "ok"
    assert "ai" in data
    assert "knowledge_base" in data
    assert data["knowledge_base"]["records_loaded"] > 0
    assert data["knowledge_base"]["status"] == "ready"


def test_knowledge_search_api():
    """Test GET /api/knowledge/search endpoint."""
    response = client.get("/api/knowledge/search?q=paddy")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "ok"
    assert data["count"] > 0
    assert len(data["results"]) > 0


def test_root_serves_frontend_spa():
    """Test that GET / serves the Grama Mitra frontend UI HTML page."""
    response = client.get("/")
    assert response.status_code == 200
    assert "html" in response.headers.get("content-type", "").lower()
    assert "Grama Mitra" in response.text or "<div id=\"root\">" in response.text


def test_spa_catch_all_routing():
    """Test that client-side SPA paths (e.g. /chat, /admin) return the frontend HTML page."""
    for path in ["/chat", "/knowledge-base", "/admin"]:
        response = client.get(path)
        assert response.status_code == 200
        assert "html" in response.headers.get("content-type", "").lower()

"""
Grama Mitra — FastAPI Backend Entry Point (Production-Ready)
Entry point: uvicorn app.main:app

Key endpoints:
  GET  /              → Root health check
  GET  /api/health    → Full service health
  GET  /api/telephony/health → Telephony health + telemetry
  POST /api/chat      → Tamil AI chat
  WS   /ws/exotel/voice → Exotel Voicebot AgentStream
"""

import sys
import os
import logging
from pathlib import Path

# ---------------------------------------------------------------------------
# Ensure backend root is on sys.path for modular service / config imports
# ---------------------------------------------------------------------------
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import chat, voice, knowledge, handoff, whatsapp, ivr, admin, telephony

# ---------------------------------------------------------------------------
# Logging — structured JSON output for production log aggregators
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("grama_mitra")

# ---------------------------------------------------------------------------
# CORS Origins
# ---------------------------------------------------------------------------
# In production, restrict to your actual frontend domain(s).
# Example: ["https://gramamitra.in", "https://www.gramamitra.in"]
# During development, ["*"] is acceptable.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if _raw_origins == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Grama Mitra API",
    description=(
        "Tamil-first AI voice assistant for rural farmers. "
        "Supports Web-based chat, WhatsApp, IVR/Exotel telephony, and admin analytics."
    ),
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global Exception Handler
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error. Please try again later."},
    )

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(chat.router,      prefix="/api",             tags=["Chat"])
app.include_router(voice.router,     prefix="/api/voice",       tags=["Voice"])
app.include_router(knowledge.router, prefix="/api/knowledge",   tags=["Knowledge"])
app.include_router(handoff.router,   prefix="/api",             tags=["Handoff"])
app.include_router(whatsapp.router,  prefix="/api/whatsapp",    tags=["WhatsApp"])
app.include_router(ivr.router,       prefix="/api/ivr",         tags=["IVR"])
app.include_router(admin.router,     prefix="/api/admin",       tags=["Admin"])
app.include_router(telephony.router, prefix="/api/telephony",   tags=["Telephony"])

# ---------------------------------------------------------------------------
# Exotel Voicebot WebSocket — Root-level path required by Exotel AgentStream
# ---------------------------------------------------------------------------
app.add_api_websocket_route("/ws/exotel/voice", telephony.exotel_voice_websocket)

# ---------------------------------------------------------------------------
# Health Endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def root_health():
    """Root health check — used by load balancers and uptime monitors."""
    return {
        "status": "ok",
        "service": "Grama Mitra API",
        "version": "1.1.0",
        "docs": "/api/docs",
    }


@app.get("/api/health", tags=["Health"])
async def api_health():
    """Full service health summary."""
    from app.ai.ai_service import GEMINI_AVAILABLE
    from app.knowledge_base.knowledge_service import knowledge_service

    telephony_enabled = os.getenv("TELEPHONY_ENABLED", "false").lower() == "true"
    mock_mode = os.getenv("TELEPHONY_MOCK_MODE", "true").lower() == "true"
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))

    return {
        "status": "ok",
        "version": "1.1.0",
        "ai": {
            "engine": "gemini-1.5-flash",
            "sdk_available": GEMINI_AVAILABLE,
            "key_configured": gemini_key_present,
            "configured": GEMINI_AVAILABLE and gemini_key_present,
        },
        "knowledge_base": {
            "records_loaded": knowledge_service.count(),
            "status": "ready" if knowledge_service.count() > 0 else "empty",
        },
        "telephony": {
            "engine": "exotel-agentstream",
            "enabled": telephony_enabled,
            "mock_mode": mock_mode,
            "websocket_path": "/ws/exotel/voice",
        },
        "database": "firestore",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


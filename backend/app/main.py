"""
Grama Mitra — FastAPI Backend Entry Point (Production-Ready)
Entry point: uvicorn app.main:app

Key endpoints:
  GET  /              → Grama Mitra Frontend Product UI (React App)
  GET  /api/health    → Full service health summary & diagnostic metrics
  POST /api/chat      → Tamil RAG & Gemini AI chat
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
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

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
# API Routers
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
# API Health Check Endpoint
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Static Assets & SPA Catch-All Route (Serves React Frontend Product UI)
# ---------------------------------------------------------------------------
possible_dist_paths = [
    Path(__file__).resolve().parent / "static",                            # backend/app/static
    Path(__file__).resolve().parent.parent / "static",                     # backend/static
    Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",   # frontend/dist
    Path(__file__).resolve().parent.parent / "frontend" / "dist",          # backend/../frontend/dist
    Path(os.getcwd()) / "backend" / "app" / "static",                      # cwd/backend/app/static
    Path(os.getcwd()) / "frontend" / "dist",                               # cwd/frontend/dist
]

frontend_dist = None
for p in possible_dist_paths:
    if p.exists() and (p / "index.html").exists():
        frontend_dist = p
        logger.info(f"Frontend static build found at: {frontend_dist}")
        break

if not frontend_dist:
    frontend_dist = Path(__file__).resolve().parent / "static"
    logger.warning(f"No index.html found in candidate paths. Defaulting to {frontend_dist}")

if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    # Protect API and WebSocket routes
    if (
        full_path.startswith("api/")
        or full_path == "api"
        or full_path.startswith("ws/")
        or full_path == "ws"
    ):
        return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})

    # Serve static assets if file exists (e.g., favicon, logo, manifest)
    file_path = frontend_dist / full_path
    if full_path and file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))

    # Fallback to index.html for React SPA client-side routes
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))

    return JSONResponse(
        status_code=404,
        content={
            "status": "error",
            "message": "Grama Mitra Frontend UI build not found. Run 'npm run build' in project root.",
            "api_health": "/api/health",
            "api_docs": "/api/docs",
        },
    )


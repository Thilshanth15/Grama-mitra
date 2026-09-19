from fastapi import APIRouter, Request, Response
router = APIRouter()

# ── WhatsApp Simulation Mode ──
# Real integration requires: WhatsApp Business Cloud API + verified phone number + webhook verification
# Webhook URL: POST /api/whatsapp/webhook
# Verification: GET /api/whatsapp/webhook

@router.get("/webhook")
async def verify_webhook(request: Request):
    """WhatsApp webhook verification (SIMULATION MODE)."""
    params = dict(request.query_params)
    challenge = params.get("hub.challenge", "")
    return Response(content=challenge, media_type="text/plain")


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    WhatsApp message webhook — SIMULATION MODE.
    
    Production flow:
    1. Receive message from WhatsApp Business API
    2. Extract text or audio
    3. If audio: send to STT (Whisper/Google)
    4. Run through Grama Mitra AI pipeline
    5. Send Tamil response back via WhatsApp API
    
    Status: INTEGRATION READY — Configure WhatsApp Business credentials to activate.
    """
    body = await request.json()
    return {
        "status": "simulation",
        "message": "WhatsApp integration is in simulation mode. Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to activate.",
        "received": body,
    }

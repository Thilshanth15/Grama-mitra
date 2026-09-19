from fastapi import APIRouter
router = APIRouter()

@router.post("/transcribe")
async def transcribe():
    """Voice transcription — uses Web Speech API on frontend. Backend integration-ready for Whisper/Google STT."""
    return {"status": "prototype", "note": "Use Web Speech API on frontend. Backend STT integration ready for Whisper/Google Cloud STT."}

@router.post("/synthesize")
async def synthesize():
    """TTS — uses Web Speech API on frontend. Backend integration-ready for Google TTS."""
    return {"status": "prototype", "note": "Use Web Speech API on frontend. Backend TTS integration ready for Google Cloud TTS."}

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    channel: str = "Website"
    intent: Optional[str] = None
    session_id: Optional[str] = None
    language: str = "ta"


class SourceModel(BaseModel):
    name: str
    url: Optional[str] = None
    last_updated: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    confidence: float
    intent: str
    is_emergency: bool = False
    needs_handoff: bool = False
    source: Optional[SourceModel] = None
    confidence_label: str
    query_id: Optional[str] = None
    handoff_id: Optional[str] = None
    alert_id: Optional[str] = None
    disclaimer: Optional[str] = None


class HandoffRequest(BaseModel):
    query: str
    query_id: Optional[str] = None
    category: str
    reason: str
    priority: str = "Normal"
    channel: str = "Website"
    session_id: Optional[str] = None


class KnowledgeRecord(BaseModel):
    id: str
    category: str
    question: str
    question_tamil: Optional[str] = None
    answer: str
    source: Optional[str] = None
    source_url: Optional[str] = None
    verified: bool = False
    last_updated: Optional[str] = None
    keywords: List[str] = []


class WhatsAppMessage(BaseModel):
    object: str
    entry: List[dict]


class IVRWebhook(BaseModel):
    CallSid: Optional[str] = None
    From: Optional[str] = None
    To: Optional[str] = None
    SpeechResult: Optional[str] = None
    Confidence: Optional[float] = None

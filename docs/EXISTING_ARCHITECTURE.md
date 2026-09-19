# Grama Mitra — Existing Architecture & Telephony Integration Baseline

## 1. Project Overview
**Grama Mitra** (கிராம மித்ரா) is a Tamil-first AI-powered rural assistance platform designed to empower rural farmers and communities across Tamil Nadu. It provides reliable guidance in:
- **Agriculture**: Crop health, pest/disease remedies, soil nutrition, irrigation (grounded in TNAU advisories).
- **Government Schemes**: PM-KISAN, PMFBY crop insurance, Kisan Credit Card, subsidized inputs.
- **Health Awareness**: Non-emergency rural health guidance with strict emergency boundaries (immediate 108 ambulance referral).

---

## 2. Existing Frontend Architecture
- **Framework**: React 19 SPA bundled with Vite 8.
- **Routing**: `react-router-dom` v6 managing public routes (`/`, `/services`, `/how-it-works`, `/assistant`, `/about`, `/contact`, `/login`) and protected officer routes (`/admin`, `/admin/hotspots`, `/admin/analytics`, `/admin/knowledge`, `/admin/safety`, `/admin/calls`, `/admin/settings`).
- **Styling**: Vanilla CSS design system (`frontend/src/index.css`) with obsidian pitch-black theme, glassmorphism, responsive grid layouts, and custom typography (`Noto Sans Tamil` + `Inter`).
- **Browser Voice Assistant**:
  - **Speech-to-Text (STT)**: Client-side Web Speech API via `SpeechRecognition` / `webkitSpeechRecognition` configured with `lang = 'ta-IN'` in [frontend/src/services/api.js](file:///c:/Users/Thil%20shanth/grama/frontend/src/services/api.js) and [frontend/src/pages/public/VoiceAssistant.jsx](file:///c:/Users/Thil%20shanth/grama/frontend/src/pages/public/VoiceAssistant.jsx).
  - **Text-to-Speech (TTS)**: Client-side `window.speechSynthesis` with `SpeechSynthesisUtterance` set to `lang = 'ta-IN'`.
  - **Visual Mic Orb**: Multi-layered pulsing orb with real-time listening/processing state transitions and live audio visualizer waveforms.

---

## 3. Existing Backend Architecture
- **Framework**: Python FastAPI (`backend/app/main.py`), running on Uvicorn ASGI server with CORS middleware.
- **API Router Structure**:
  - `/api/chat` ([backend/app/routes/chat.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/chat.py)): Unified query processing endpoint executing safety checks, intent categorization, knowledge retrieval, and grounded AI generation.
  - `/api/voice` ([backend/app/routes/voice.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/voice.py)): Voice transcription and TTS stub endpoints ready for server-side integration.
  - `/api/knowledge` ([backend/app/routes/knowledge.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/knowledge.py)): Verified rural knowledge base management.
  - `/api/ivr` ([backend/app/routes/ivr.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/ivr.py)): Prototype IVR phone webhook contract.
  - `/api/whatsapp` ([backend/app/routes/whatsapp.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/whatsapp.py)): WhatsApp webhook listener for incoming rural messaging.
  - `/api/admin` ([backend/app/routes/admin.py](file:///c:/Users/Thil%20shanth/grama/backend/app/routes/admin.py)): Officer dashboard analytics and query management.

---

## 4. Existing AI & Safety Pipeline
- **AI Service** ([backend/app/ai/ai_service.py](file:///c:/Users/Thil%20shanth/grama/backend/app/ai/ai_service.py)):
  - Uses Google Gemini 1.5 Flash (`google.generativeai`) configured with `GEMINI_API_KEY`.
  - System prompt enforces concise rural Tamil responses, strictly grounded in verified context.
  - Built-in rule-based fallback when the Gemini API is offline or unconfigured.
  - Rule-based intent classifier supporting Tamil and English keywords: `AGRICULTURE`, `GOVERNMENT_SCHEME`, `HEALTH`, `GENERAL`.
- **Safety Service** ([backend/app/safety/safety_service.py](file:///c:/Users/Thil%20shanth/grama/backend/app/safety/safety_service.py)):
  - Emergency keyword detector in Tamil and English (e.g., chest pain / மார்பு வலி, breathing difficulty / மூச்சுத்திணறல், poisoning / நஞ்சு).
  - High-priority medical emergency protocol redirecting callers immediately to **108 Ambulance**.
  - Health query boundary checks ensuring the assistant never acts as a doctor or prescribes prescription medications.

---

## 5. Existing Data & Knowledge Management
- **Knowledge Base**: Curated snippets covering paddy blast diseases, nitrogen deficiencies, fertilizer doses (TNAU guidelines), PM-KISAN enrollment, and WHO first-aid rules.
- **Pydantic Schemas** ([backend/app/models/schemas.py](file:///c:/Users/Thil%20shanth/grama/backend/app/models/schemas.py)):
  - `ChatRequest` (message, channel, intent, language)
  - `ChatResponse` (response, confidence, intent, is_emergency, needs_handoff, disclaimer)
  - `HandoffRequest` (officer intervention queue)
  - `IVRWebhook` (telephony call data container)

---

## 6. Integration Strategy for Real Phone Calling
1. **Preservation**: The browser Web Speech STT/TTS engine in the web app remains untouched for web visitors.
2. **Backend Telephony Extension**:
   - Exotel AgentStream / Voicebot Applet connects via a persistent, bidirectional WebSocket at `/ws/exotel/voice`.
   - Audio is ingested as base64 16-bit linear PCM (8kHz/16kHz mono), converted, processed by STT, passed through the existing Gemini AI and safety layer, converted back to PCM audio via TTS, and streamed back to Exotel in ~100ms chunks (multiples of 320 bytes).
3. **Decoupled Provider Architecture**: Decoupled modules for audio processing, session tracking, STT, and TTS with built-in mock fallback for development without telco fees.

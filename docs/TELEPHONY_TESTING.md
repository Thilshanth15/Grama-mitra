# Grama Mitra — Telephony Testing Guide

This guide describes how to thoroughly test the **Exotel AgentStream / Voicebot Applet** telephony integration using the local mock testing harness before connecting to live telecommunication lines.

---

## 1. Overview of Mock Mode
When `TELEPHONY_MOCK_MODE=true` in your `.env`:
- **Audio Generation**: Uses synthetic 16-bit linear PCM audio buffers (sine wave tones and silence frames) matching Exotel's exact 8kHz/16kHz format.
- **Speech Recognition (STT)**: Generates realistic farmer queries in Tamil (e.g. paddy leaf yellowing, PM-KISAN, fertilizer usage) without incurring third-party API costs.
- **AI Processing**: Evaluates safety keywords, detects emergency conditions (108 protocol), categorizes intents (`AGRICULTURE`, `GOVERNMENT_SCHEME`, `HEALTH`, `GENERAL`), and generates spoken Tamil responses.
- **Text-to-Speech (TTS)**: Synthesizes spoken Tamil text into PCM audio frames chunked in 100ms blocks (multiples of 320 bytes).
- **Session Management**: Simulates full call lifecycles, measuring turnaround latency and barge-in handling.

---

## 2. Automated Test Suite Execution

Run the complete telephony test suite using `pytest`:

```bash
cd backend
pytest tests/test_telephony.py -v
```

### What the test suite covers:
1. `test_audio_encoding_decoding`: Validates base64 ↔ raw PCM binary transformations.
2. `test_rms_energy_silence_vs_tone`: Verifies energy-based Voice Activity Detection (VAD).
3. `test_audio_chunking_alignment`: Ensures all streamed audio chunks are multiples of 320 bytes.
4. `test_exotel_media_event_creation`: Validates Exotel JSON message formats (`start`, `media`, `clear`, `stop`).
5. `test_session_lifecycle`: Confirms turn tracking, audio buffer clearing, and cleanup.
6. `test_emergency_safety_escalation`: Verifies that emergencies trigger the immediate 108 directive.
7. `test_agriculture_response_generation`: Confirms concise rural Tamil answers without markdown asterisks.
8. `test_end_to_end_mock_pipeline`: Runs a full simulated audio call cycle.

---

## 3. Testing via the HTTP Mock Endpoint

Start the backend server:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Check Telephony Health:
```bash
curl http://localhost:8000/api/telephony/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "service": "Grama Mitra Telephony (Exotel AgentStream)",
  "telephony_enabled": false,
  "mock_mode": true,
  "audio_specs": {
    "format": "audio/x-l16",
    "sample_rate": 8000,
    "channels": 1,
    "chunk_size_ms": 100,
    "bytes_per_chunk": 1600
  },
  "websocket_endpoint": "/ws/exotel/voice",
  "active_calls": 0,
  "total_test_sessions": 0
}
```

### Trigger a Simulated Call:
```bash
curl -X POST http://localhost:8000/api/telephony/test-call \
  -H "Content-Type: application/json" \
  -d '{
    "caller_phone": "+919876543210",
    "simulated_speech": "நெல் இலை மஞ்சள் நோய்க்கு என்ன மருந்து அடிக்க வேண்டும்?"
  }'
```
**Expected Output:**
- `status`: `"success"`
- `spoken_response_tamil`: Spoken Tamil advice (e.g., urea/neem cake advisory)
- `intent`: `"AGRICULTURE"`
- `is_emergency`: `false`
- `pcm_audio_bytes`: Byte count of generated audio
- `total_exotel_chunks`: Number of 100ms frames generated (each a multiple of 320 bytes)

---

## 4. Testing with a WebSocket Client

You can simulate Exotel's Voicebot Applet sending raw WebSocket frames using a lightweight Python script:

```python
import asyncio
import json
import base64
import websockets

async def simulate_exotel_call():
    uri = "ws://localhost:8000/ws/exotel/voice"
    stream_sid = "test-stream-001"
    
    async with websockets.connect(uri) as ws:
        print("Connected to Grama Mitra Voicebot WebSocket.")
        
        # 1. Send Exotel Start Event
        start_event = {
            "event": "start",
            "stream_sid": stream_sid,
            "start": {
                "account_sid": "EXO_TEST_ACCOUNT",
                "call_sid": "CALL_TEST_001",
                "stream_sid": stream_sid,
                "custom_parameters": {
                    "From": "+919876543210"
                }
            }
        }
        await ws.send(json.dumps(start_event))
        print("Sent 'start' event. Listening for welcome greeting...")
        
        # 2. Receive Initial Greeting Audio Packets
        greeting_chunks = 0
        while True:
            response = await asyncio.wait_for(ws.recv(), timeout=5.0)
            data = json.loads(response)
            if data.get("event") == "media":
                greeting_chunks += 1
                if greeting_chunks >= 10:
                    break
        print(f"Received {greeting_chunks} welcome audio chunks from Grama Mitra!")
        
        # 3. Simulate Farmer Speech: 1.5 seconds of PCM audio
        dummy_pcm = b"\x10\x00" * 6000  # Non-zero audio frame
        dummy_b64 = base64.b64encode(dummy_pcm).decode("utf-8")
        media_event = {
            "event": "media",
            "stream_sid": stream_sid,
            "media": {
                "payload": dummy_b64
            }
        }
        await ws.send(json.dumps(media_event))
        print("Sent farmer speech audio frame.")
        
        # 4. Send 1.2 seconds of silence to trigger end-of-speech turnaround
        silence_b64 = base64.b64encode(b"\x00" * 9600).decode("utf-8")
        silence_event = {
            "event": "media",
            "stream_sid": stream_sid,
            "media": {
                "payload": silence_b64
            }
        }
        await ws.send(json.dumps(silence_event))
        print("Sent silence frame to trigger response turn.")
        
        # 5. Receive AI Spoken Response
        response_chunks = 0
        try:
            while True:
                resp = await asyncio.wait_for(ws.recv(), timeout=4.0)
                d = json.loads(resp)
                if d.get("event") == "media":
                    response_chunks += 1
        except asyncio.TimeoutError:
            print(f"Turn turnaround complete. Total response audio chunks: {response_chunks}")
            
        # 6. Send Stop Event
        stop_event = {
            "event": "stop",
            "stream_sid": stream_sid,
            "stop": {
                "call_sid": "CALL_TEST_001"
            }
        }
        await ws.send(json.dumps(stop_event))
        print("Call terminated cleanly.")

asyncio.run(simulate_exotel_call())
```

---

## 5. Pre-Deployment Verification Checklist

Before taking the system live to real telephone calls:
- [ ] All unit tests in `tests/test_telephony.py` pass cleanly.
- [ ] Emergency keyword detector triggers the 108 ambulance prompt.
- [ ] Output audio chunks are confirmed to be multiples of 320 bytes.
- [ ] Telemetry endpoint `/api/telephony/health` is reachable and reflects operational counts.
- [ ] The Admin UI displays the new **Phone Assistant Configuration** panel without errors.

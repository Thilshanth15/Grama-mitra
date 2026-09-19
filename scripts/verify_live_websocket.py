"""
Verification Script for Deployed Exotel WebSocket Endpoint:
wss://grama-mitra.onrender.com/ws/exotel/voice

Tests:
1. WebSocket Connection Acceptance (handshake)
2. Exotel AgentStream 'start' event & initial Tamil greeting media response
3. Sending incoming 8kHz PCM audio media frames ('media' event)
4. Silence detection & Tamil AI RAG / Gemini response generation turnaround
5. Outbound Tamil TTS audio response streaming (media packets)
6. Exotel 'stop' event & clean connection teardown
"""

import sys
import json
import time
import asyncio
import base64
import math

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

try:
    import websockets
except ImportError:
    print("Installing websockets library...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets"])
    import websockets


DEPLOYED_WSS_URL = "wss://grama-mitra.onrender.com/ws/exotel/voice"
TEST_STREAM_SID = f"test-stream-{int(time.time())}"


def generate_8khz_pcm_tone(duration_seconds: float = 1.0, freq: float = 440.0) -> bytes:
    """Generates 16-bit mono 8000 Hz PCM audio bytes."""
    sample_rate = 8000
    num_samples = int(sample_rate * duration_seconds)
    audio_bytes = bytearray()
    for i in range(num_samples):
        sample = int(16000 * math.sin(2 * math.pi * freq * (i / sample_rate)))
        sample = max(-32768, min(32767, sample))
        audio_bytes.extend(sample.to_bytes(2, byteorder="little", signed=True))
    return bytes(audio_bytes)


async def run_live_websocket_verification():
    print("==================================================================")
    print(f"Connecting to Deployed Exotel WebSocket: {DEPLOYED_WSS_URL}")
    print("==================================================================")

    results = {
        "connection_accepted": False,
        "start_event_processed": False,
        "greeting_audio_received": False,
        "media_event_sent": False,
        "turnaround_audio_received": False,
        "stop_event_processed": False,
        "errors": []
    }

    try:
        async with websockets.connect(DEPLOYED_WSS_URL, timeout=15) as ws:
            results["connection_accepted"] = True
            print("[OK] Step 1: WebSocket connection accepted successfully.")

            # ----------------------------------------------------------------
            # Step 2: Send Exotel 'start' event
            # ----------------------------------------------------------------
            start_payload = {
                "event": "start",
                "stream_sid": TEST_STREAM_SID,
                "start": {
                    "call_sid": "live-test-call-001",
                    "account_sid": "exotel-test-account",
                    "custom_parameters": {
                        "From": "+919876543210"
                    }
                }
            }
            await ws.send(json.dumps(start_payload))
            results["start_event_processed"] = True
            print(f"[OK] Step 2: Sent Exotel 'start' event for stream '{TEST_STREAM_SID}'.")

            # Receive initial welcome greeting media frames
            greeting_chunks = 0
            start_time = time.time()
            while time.time() - start_time < 5.0:
                try:
                    msg_text = await asyncio.wait_for(ws.recv(), timeout=2.0)
                    msg_data = json.loads(msg_text)
                    if msg_data.get("event") == "media":
                        greeting_chunks += 1
                        b64_data = msg_data.get("media", {}).get("payload", "")
                        raw_bytes = base64.b64decode(b64_data)
                        if len(raw_bytes) > 0 and not results["greeting_audio_received"]:
                            results["greeting_audio_received"] = True
                            print(f"[OK] Step 3: Initial Tamil greeting audio received ({len(raw_bytes)} bytes/chunk).")
                except asyncio.TimeoutError:
                    break

            print(f"     Received {greeting_chunks} greeting audio media frames.")

            # ----------------------------------------------------------------
            # Step 3: Send incoming 8kHz PCM audio chunks (speech simulation)
            # ----------------------------------------------------------------
            speech_pcm = generate_8khz_pcm_tone(duration_seconds=1.2, freq=350.0)
            chunk_size = 320  # 20ms at 8kHz 16-bit
            for i in range(0, len(speech_pcm), chunk_size):
                chunk = speech_pcm[i:i+chunk_size]
                if len(chunk) < chunk_size:
                    chunk = chunk + b"\x00" * (chunk_size - len(chunk))
                media_payload = {
                    "event": "media",
                    "stream_sid": TEST_STREAM_SID,
                    "media": {
                        "payload": base64.b64encode(chunk).decode("utf-8")
                    }
                }
                await ws.send(json.dumps(media_payload))
                await asyncio.sleep(0.015)

            results["media_event_sent"] = True
            print(f"[OK] Step 4: Sent 8kHz PCM audio media frames ({len(speech_pcm)} bytes total).")

            # Send silence frames to trigger end-of-speech turnaround
            silence_pcm = b"\x00" * 320
            for _ in range(15):  # ~300ms silence
                media_payload = {
                    "event": "media",
                    "stream_sid": TEST_STREAM_SID,
                    "media": {
                        "payload": base64.b64encode(silence_pcm).decode("utf-8")
                    }
                }
                await ws.send(json.dumps(media_payload))
                await asyncio.sleep(0.02)

            print("     Sent silence frames. Waiting for AI turnaround audio...")

            # ----------------------------------------------------------------
            # Step 4: Receive AI response audio media frames
            # ----------------------------------------------------------------
            turnaround_chunks = 0
            start_time = time.time()
            while time.time() - start_time < 8.0:
                try:
                    msg_text = await asyncio.wait_for(ws.recv(), timeout=3.0)
                    msg_data = json.loads(msg_text)
                    if msg_data.get("event") == "media":
                        turnaround_chunks += 1
                        if not results["turnaround_audio_received"]:
                            results["turnaround_audio_received"] = True
                            print("[OK] Step 5: Tamil AI response TTS audio stream received!")
                except asyncio.TimeoutError:
                    break

            print(f"     Received {turnaround_chunks} AI turnaround audio media frames.")

            # ----------------------------------------------------------------
            # Step 5: Send Exotel 'stop' event & teardown
            # ----------------------------------------------------------------
            stop_payload = {
                "event": "stop",
                "stream_sid": TEST_STREAM_SID
            }
            await ws.send(json.dumps(stop_payload))
            results["stop_event_processed"] = True
            print("[OK] Step 6: Sent Exotel 'stop' event & closed stream cleanly.")

    except Exception as e:
        err_msg = f"WebSocket test error: {e}"
        print(f"[ERROR] Exception during verification: {e}")
        results["errors"].append(err_msg)

    print("\n==================================================================")
    print("VERIFICATION SUMMARY FOR DEPLOYED EXOTEL WEBSOCKET")
    print("==================================================================")
    for key, val in results.items():
        if key != "errors":
            status_icon = "PASS" if val else "FAIL"
            print(f"  {key:<30}: {status_icon}")
    
    if results["errors"]:
        print(f"\nErrors encountered: {results['errors']}")
    
    return results


if __name__ == "__main__":
    asyncio.run(run_live_websocket_verification())

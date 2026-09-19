# Grama Mitra — Exotel Voicebot Applet Configuration Guide

This guide details the exact steps to configure your Exotel account and custom call flow to connect incoming telephone calls to the Grama Mitra Tamil voice assistant.

---

## 1. Prerequisites & Account Approval

> [!IMPORTANT]
> **Streaming Applet Enablement**:
> - Audio streaming applets (**Voicebot Applet** and **Stream Applet**) are **not enabled by default** on standard Exotel accounts.
> - **KYC Requirement**: Complete your business/entity KYC verification on the Exotel dashboard.
> - **Feature Request**: Contact your Exotel Account Manager or email `hello@exotel.com` requesting enablement of:
>   - **Feature**: *Voicebot Applet (Bidirectional WebSocket Audio Streaming)*
>   - **Account SID**: Found under your Exotel Account Settings.
>   - **Use Case**: *Conversational Tamil AI Voicebot for rural farmer agricultural queries*.

---

## 2. Voicebot Applet vs. Stream Applet

Exotel offers two streaming applets:
- **Voicebot Applet (Required)**: **Bidirectional audio stream**. Streams incoming audio from the caller to your server and plays outgoing audio received from your server back to the caller in real time. **This is the applet required for Grama Mitra.**
- **Stream Applet (Unidirectional)**: Streams audio from the caller to your server only (used for call transcription or compliance recording, but cannot play synthesized audio back to the caller).

---

## 3. Step-by-Step Exotel Dashboard Configuration

### Step 1: Access the Call Flow Builder
1. Log in to your [Exotel Dashboard](https://my.exotel.com/).
2. Navigate to **App Bazaar** (or **Call Flows**) from the left navigation menu.
3. Click **Create Flow** or edit your existing inbound flow.

### Step 2: Add the Voicebot Applet
1. From the applet library on the left sidebar, drag the **Voicebot Applet** (or **Media Stream**) onto the flow canvas.
2. Connect the **Start of Call** connector to the top input of the Voicebot Applet.

### Step 3: Configure the Voicebot Applet Fields
Click on the Voicebot Applet to open its configuration inspector:

| Field Name | Setting / Value | Description |
| :--- | :--- | :--- |
| **Stream URL / Endpoint** | `wss://YOUR_PUBLIC_DOMAIN/ws/exotel/voice` | Your deployed secure WebSocket endpoint (must use `wss://`). |
| **Stream Type / Direction** | **Bidirectional** | Allows Grama Mitra to send spoken Tamil audio back to the caller. |
| **Audio Format / Codec** | **Linear PCM (16-bit, Little Endian)** | Raw audio encoding (`audio/x-l16`). |
| **Sample Rate** | **8000 Hz** (or 16000 Hz) | Standard telco narrow-band sample rate. |
| **Chunk Size / Interval** | **100 ms** (1600 bytes) | Ensures smooth, low-latency audio transmission. |
| **Custom Parameters** | `caller_id = {From}`, `call_sid = {CallSid}` | Passes caller telephone number and call ID to your backend. |

### Step 4: Configure Fallback Applet
1. If the WebSocket connection fails or the bot terminates the call, route the flow to a fallback applet:
   - Connect the **Stream Disconnected** or **Error** branch to a **Say/Play Applet** with a short message:
     *"தொழில்நுட்ப கோளாறு காரணமாக அழைப்பு துண்டிக்கப்பட்டது. சிறிது நேரம் கழித்து மீண்டும் அழைக்கவும்."*
   - Connect to a **Hangup Applet**.

### Step 5: Save and Assign Virtual Number
1. Click **Save** in the top right of the flow designer.
2. Go to **Numbers** (Virtual Numbers) in your Exotel dashboard.
3. Select your assigned phone number (e.g. `+91-80XXXXXXXX`).
4. In the **Installed App** dropdown, select your newly saved **Grama Mitra Voicebot Flow**.
5. Click **Attach**.

---

## 4. End-to-End Phone Testing Procedure

1. **Verify Backend Health**:
   Open `https://YOUR_PUBLIC_DOMAIN/api/telephony/health` in your browser. Ensure status is `"ok"`.
2. **Watch Real-Time Logs**:
   On your backend server, monitor the live uvicorn log:
   ```bash
   journalctl -u grama-mitra -f
   ```
3. **Dial the Exotel Number from a Mobile Phone**:
   - The phone rings and connects.
   - You should hear the Tamil welcome greeting:
     *"வணக்கம்! நான் கிராம மித்ரா. உங்கள் விவசாயம், அரசு திட்டங்கள் மற்றும் பொதுவான உதவிக்கு நான் உதவுவேன். உங்களுக்கு என்ன உதவி வேண்டும்?"*
4. **Ask an Agriculture Question**:
   - Speak in Tamil: *"நெல் இலை மஞ்சள் நோய்க்கு என்ன உரம் போட வேண்டும்?"*
   - Pause for 1 second.
   - Grama Mitra processes the speech and speaks back the advice in rural Tamil.
5. **Test Emergency Safety Detection**:
   - Speak: *"எனக்கு நெஞ்சு வலி அதிகமாக உள்ளது"*
   - The assistant immediately instructs you to call 108 ambulance.
6. **Hang Up**:
   - Ending the call triggers the Exotel `stop` event; the session cleans up and logs the total turns.

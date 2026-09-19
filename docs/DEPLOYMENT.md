# Grama Mitra — Production Deployment Guide

> **Status**: Backend mock pipeline verified ✅ — Real phone calling **not yet enabled**  
> `TELEPHONY_ENABLED=false` | `TELEPHONY_MOCK_MODE=true`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Backend Verification Checklist](#2-backend-verification-checklist)
3. [Recommended Deployment Platform — Render](#3-recommended-deployment-platform--render)
4. [Step-by-Step Deployment to Render](#4-step-by-step-deployment-to-render)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Local Production Simulation](#6-local-production-simulation)
7. [Nginx VPS Deployment (Advanced)](#7-nginx-vps-deployment-advanced)
8. [Frontend Deployment (Vercel)](#8-frontend-deployment-vercel)
9. [Development Tunneling with ngrok](#9-development-tunneling-with-ngrok)
10. [Enabling Live Telephony (When Ready)](#10-enabling-live-telephony-when-ready)
11. [Health Checks & Monitoring](#11-health-checks--monitoring)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture Overview

```
Internet
  ├── Farmers (Web/WhatsApp/Phone)
  │     │
  │     ▼
  ├── Frontend (Vite/React) ──────────────────────► Vercel / Netlify / GitHub Pages
  │     │ HTTPS REST API calls
  │     ▼
  └── Backend (FastAPI + Uvicorn) ─────────────────► Render / Railway / VPS
        ├── GET  /                   → Root health check
        ├── GET  /api/health         → Full service health
        ├── POST /api/chat           → Tamil AI chat (Gemini)
        ├── GET  /api/telephony/health → Telephony telemetry
        ├── POST /api/telephony/test-call → Mock call test
        └── WS   /ws/exotel/voice   → Exotel Voicebot AgentStream
              │
              ▼ (when TELEPHONY_ENABLED=true)
        Exotel Cloud ────────────────────────────► Farmer's Phone (PSTN)
```

---

## 2. Backend Verification Checklist

Before deploying, confirm each item locally:

| Check | Command | Expected |
|:------|:--------|:---------|
| Entry point exists | `ls backend/app/main.py` | ✅ File present |
| All routes load | `cd backend && python -c "from app.main import app; print('OK')"` | `OK` |
| Health endpoint | `curl http://localhost:8000/` | `{"status":"ok",...}` |
| API health | `curl http://localhost:8000/api/health` | `{"status":"ok",...}` |
| Telephony health | `curl http://localhost:8000/api/telephony/health` | `{"status":"ok","mock_mode":true,...}` |
| Mock call test | `curl -X POST http://localhost:8000/api/telephony/test-call` | Tamil AI response JSON |
| WebSocket | `wscat -c ws://localhost:8000/ws/exotel/voice` | Connection accepted |
| TELEPHONY_ENABLED | `echo $TELEPHONY_ENABLED` | `false` |
| TELEPHONY_MOCK_MODE | `echo $TELEPHONY_MOCK_MODE` | `true` |

### Run Locally First

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Verify: `http://127.0.0.1:8000/api/docs` — OpenAPI Swagger UI should appear.

---

## 3. Recommended Deployment Platform — Render

**Why Render?**

| Requirement | Render Support |
|:-----------|:---------------|
| Public HTTPS | ✅ Auto-provisioned (Let's Encrypt) |
| Secure WSS WebSocket | ✅ Native WebSocket upgrade passthrough |
| Long-running connections | ✅ Up to 1 hour idle timeout (configurable) |
| Environment variables | ✅ Encrypted secret store in dashboard |
| Region close to India | ✅ Singapore (`sgp`) datacenter |
| Free tier available | ✅ Yes (spins down after 15 min idle) |
| GitHub auto-deploy | ✅ Yes |

**Alternatives:**
- **Railway** — Similar to Render, excellent WebSocket support, easy env management
- **Fly.io** — Best for latency-sensitive workloads, regional edge deployment, excellent WebSocket support
- **DigitalOcean App Platform** — Fully managed, supports WebSockets
- **VPS (Ubuntu + Nginx)** — Most control; see [Section 7](#7-nginx-vps-deployment-advanced)

> ⚠️ **Avoid:** Vercel, AWS Lambda, or any serverless platform for the backend — they do not support long-lived WebSocket connections required by Exotel AgentStream.

---

## 4. Step-by-Step Deployment to Render

### Step 1 — Push to GitHub

```bash
# From the grama project root
git init
git add .
git commit -m "feat: Grama Mitra v1.1.0 — production-ready backend"
git remote add origin https://github.com/YOUR_USERNAME/grama-mitra.git
git push -u origin main
```

> Make sure `.gitignore` excludes `.env`, `venv/`, and `__pycache__/`.

---

### Step 2 — Create a Render Web Service

1. Go to **[render.com](https://render.com)** → Sign in → **New → Web Service**
2. Connect your GitHub repository
3. Set the **Root Directory** to `backend`
4. Configure:

| Field | Value |
|:------|:------|
| **Name** | `grama-mitra-api` |
| **Region** | `Singapore (Southeast Asia)` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT --ws websockets` |
| **Plan** | Starter (free) or Standard for production |

---

### Step 3 — Set Environment Variables in Render Dashboard

Navigate to your service → **Environment** tab → Add each variable:

#### Required (Must Set)

| Variable | Value |
|:---------|:------|
| `GEMINI_API_KEY` | `AIzaSy_your_actual_key` |
| `ENVIRONMENT` | `production` |
| `ALLOWED_ORIGINS` | `https://your-frontend-domain.vercel.app` |

#### Telephony (Keep These Until Exotel Is Configured)

| Variable | Value |
|:---------|:------|
| `TELEPHONY_ENABLED` | `false` |
| `TELEPHONY_MOCK_MODE` | `true` |

#### Optional Audio (Defaults Are Safe)

| Variable | Default | Notes |
|:---------|:--------|:------|
| `TELEPHONY_SAMPLE_RATE` | `8000` | Exotel standard |
| `TELEPHONY_CHUNK_SIZE_MS` | `100` | 100ms audio frames |
| `VAD_ENERGY_THRESHOLD` | `350` | Voice detection sensitivity |
| `VAD_SILENCE_DURATION` | `1.1` | Seconds of silence to end a turn |
| `LOG_LEVEL` | `INFO` | Use `DEBUG` only for troubleshooting |

---

### Step 4 — Deploy

Click **Create Web Service** → Render will:
1. Clone your repo
2. Install dependencies (`pip install -r requirements.txt`)
3. Start the server with `uvicorn app.main:app ...`
4. Assign a public URL like: `https://grama-mitra-api.onrender.com`

---

### Step 5 — Verify Deployment

```bash
# Root health check
curl https://grama-mitra-api.onrender.com/

# Full health check
curl https://grama-mitra-api.onrender.com/api/health

# Telephony telemetry
curl https://grama-mitra-api.onrender.com/api/telephony/health

# Mock AI call test
curl -X POST https://grama-mitra-api.onrender.com/api/telephony/test-call \
  -H "Content-Type: application/json" \
  -d '{"caller_phone": "+919876543210", "simulated_speech": "நெல் இலை மஞ்சள் நோய்க்கு என்ன செய்வது?"}'

# WebSocket test (install wscat: npm install -g wscat)
wscat -c wss://grama-mitra-api.onrender.com/ws/exotel/voice
```

Expected responses:
- Health: `{"status": "ok", "version": "1.1.0", ...}`
- Mock call: Tamil AI response with `spoken_response_tamil`, `intent`, `pcm_audio_bytes`
- WebSocket: Connection accepted (no immediate disconnect)

---

## 5. Environment Variables Reference

### Complete Reference

| Variable | Required | Default | Description |
|:---------|:---------|:--------|:------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `ENVIRONMENT` | No | `development` | `development` or `production` |
| `LOG_LEVEL` | No | `INFO` | `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `ALLOWED_ORIGINS` | No | `*` | Comma-separated frontend origins |
| `TELEPHONY_ENABLED` | No | `false` | `true` = live Exotel calls enabled |
| `TELEPHONY_MOCK_MODE` | No | `true` | `true` = safe simulation mode |
| `EXOTEL_ACCOUNT_SID` | When enabled | — | From Exotel Dashboard |
| `EXOTEL_API_KEY` | When enabled | — | From Exotel Dashboard |
| `EXOTEL_API_TOKEN` | When enabled | — | From Exotel Dashboard |
| `EXOTEL_PHONE_NUMBER` | When enabled | — | Your Exotel virtual number |
| `EXOTEL_WEBSOCKET_URL` | When enabled | — | `wss://your-domain/ws/exotel/voice` |
| `TELEPHONY_SAMPLE_RATE` | No | `8000` | Exotel audio rate (Hz) |
| `TELEPHONY_CHUNK_SIZE_MS` | No | `100` | Audio frame duration (ms) |
| `VAD_ENERGY_THRESHOLD` | No | `350` | Voice activity detection level |
| `VAD_SILENCE_DURATION` | No | `1.1` | Seconds of silence to end speech |
| `STT_API_KEY` | No | — | Cloud STT key (blank = mock STT) |
| `TTS_API_KEY` | No | — | Cloud TTS key (blank = synthetic PCM) |

### Secret Handling Rules

> [!CAUTION]
> **Never** store secrets in source code or commit `.env` files to Git.
> - Use Render Dashboard → Environment for production secrets
> - Use `.env.production.example` as a reference template only
> - Rotate `GEMINI_API_KEY` if accidentally exposed

---

## 6. Local Production Simulation

Simulate production locally before deploying:

```bash
cd backend

# Copy and configure the production env template
cp .env.production.example .env
# Edit .env: add your GEMINI_API_KEY, keep TELEPHONY_ENABLED=false

# Install deps
pip install -r requirements.txt

# Start in production-like mode (no --reload, workers=2)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2 --ws websockets
```

Then run the full mock pipeline test:

```bash
# Test AI chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "நெல் இலை மஞ்சள் நோய்க்கு என்ன உரம் போட வேண்டும்?", "language": "ta"}'

# Test mock telephony call (end-to-end AI pipeline)
curl -X POST http://localhost:8000/api/telephony/test-call \
  -H "Content-Type: application/json" \
  -d '{"caller_phone": "+919876543210", "simulated_speech": "PM Kisan pana eppadi apply pannuvadhu?"}'
```

---

## 7. Nginx VPS Deployment (Advanced)

For a DigitalOcean / AWS EC2 / Hetzner VPS:

### Install & Configure

```bash
# On Ubuntu 22.04
sudo apt update && sudo apt install -y python3.11 python3.11-venv nginx certbot python3-certbot-nginx

# Clone repo
git clone https://github.com/YOUR_USERNAME/grama-mitra.git /opt/grama
cd /opt/grama/backend

# Setup venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.production.example .env
nano .env   # Fill in GEMINI_API_KEY, ALLOWED_ORIGINS, etc.
```

### Systemd Service

Create `/etc/systemd/system/grama-mitra.service`:

```ini
[Unit]
Description=Grama Mitra FastAPI Backend
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/opt/grama/backend
EnvironmentFile=/opt/grama/.env
ExecStart=/opt/grama/backend/venv/bin/uvicorn app.main:app \
          --host 0.0.0.0 \
          --port 8000 \
          --workers 2 \
          --ws websockets \
          --log-level info
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable grama-mitra
sudo systemctl start grama-mitra
sudo systemctl status grama-mitra
```

### Nginx Configuration

Create `/etc/nginx/sites-available/grama-mitra`:

```nginx
server {
    server_name api.gramamitra.in;   # Replace with your domain

    listen 443 ssl http2;
    ssl_certificate     /etc/letsencrypt/live/api.gramamitra.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gramamitra.in/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Standard API endpoints
    location / {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Exotel Voicebot WebSocket — requires long-lived connection + WS headers
    location /ws/exotel/voice {
        proxy_pass         http://127.0.0.1:8000/ws/exotel/voice;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout  3600s;  # 1 hour — required for calls
        proxy_send_timeout  3600s;
        proxy_connect_timeout 60s;
    }
}

server {
    listen 80;
    server_name api.gramamitra.in;
    return 301 https://$host$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/grama-mitra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d api.gramamitra.in
```

---

## 8. Frontend Deployment (Vercel)

```bash
cd frontend

# Create .env with production API URL
echo "VITE_API_URL=https://grama-mitra-api.onrender.com" > .env.production

# Build production bundle
npm run build

# Deploy with Vercel CLI
npx vercel --prod
```

Or connect your GitHub repo to Vercel and set `VITE_API_URL` in the Vercel project settings.

---

## 9. Development Tunneling with ngrok

For testing real Exotel calls from your local machine:

```bash
# Terminal 1: Start backend
cd backend && uvicorn app.main:app --port 8000

# Terminal 2: Open public tunnel
ngrok http 8000
```

ngrok provides URLs like:
- HTTPS API: `https://abc123.ngrok-free.app`
- WSS WebSocket: `wss://abc123.ngrok-free.app/ws/exotel/voice`

Enter the WSS URL in your Exotel Voicebot Applet configuration.

> [!WARNING]
> Free ngrok URLs change every restart. Use ngrok paid plans or a static domain for persistent Exotel configuration.

---

## 10. Enabling Live Telephony (When Ready)

Only do this **after** completing:
1. ✅ Backend deployed publicly with HTTPS/WSS
2. ✅ `wss://YOUR_DOMAIN/ws/exotel/voice` responds to WebSocket connections
3. ✅ Exotel account KYC approved and Voicebot Applet created
4. ✅ Exotel dashboard: WSS URL set to your deployed endpoint
5. ✅ Test call from Exotel dashboard succeeds

Then update environment variables:
```env
TELEPHONY_ENABLED=true
TELEPHONY_MOCK_MODE=false
EXOTEL_ACCOUNT_SID=your_real_sid
EXOTEL_API_KEY=your_real_key
EXOTEL_API_TOKEN=your_real_token
EXOTEL_PHONE_NUMBER=+918XXXXXXXXX
EXOTEL_WEBSOCKET_URL=wss://your-actual-domain/ws/exotel/voice
```

Restart the service after updating.

---

## 11. Health Checks & Monitoring

### Endpoints

| Endpoint | Purpose |
|:---------|:--------|
| `GET /` | Root health — load balancer probe |
| `GET /api/health` | Full stack status (AI, telephony, env) |
| `GET /api/telephony/health` | Telephony stats, active calls, errors |
| `GET /api/docs` | Swagger UI (disable in production if needed) |

### Recommended Free Monitoring

- **UptimeRobot** (uptimerobot.com) — Monitor `GET /api/health` every 5 minutes, free tier
- **Betterstack** — Log aggregation + uptime + incident alerts
- **Render Built-in** — Render dashboard shows deploy logs, metrics, and health

---

## 12. Troubleshooting

### WebSocket Handshake Error (400 / 426 / 502)
- Verify your proxy passes `Upgrade: websocket` and `Connection: upgrade` headers
- Test: `wscat -c wss://YOUR_DOMAIN/ws/exotel/voice`

### Call Disconnects After 30–60 Seconds
- Check `proxy_read_timeout 3600s` in Nginx (VPS)
- On Render: timeouts are managed automatically; ensure `--ws websockets` flag in start command

### Gemini AI Not Responding
- Check `GEMINI_API_KEY` is set correctly in Render Environment tab
- Verify at `GET /api/health` → look at `ai.configured` field

### 503 Service Unavailable on Render Free Tier
- Free tier services spin down after 15 minutes of inactivity (first request takes ~30s to wake)
- Upgrade to Render Starter ($7/mo) for always-on service, or use UptimeRobot to ping every 14 minutes

### Distorted Audio Over Phone
- Confirm sample rate is `8000 Hz` in Exotel Applet settings
- Verify `TELEPHONY_SAMPLE_RATE=8000` matches Exotel configuration
- Audio frames must be exact multiples of 320 bytes (1600 bytes for 100ms at 8kHz)

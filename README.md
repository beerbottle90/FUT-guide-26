# FUT Arthur Guide ⚽

AI-powered EA FC 26 Ultimate Team advisor. Upload screenshots or ask questions to get expert advice on squads, SBCs, and the transfer market.

## Features

| Tab | What it does |
|-----|-------------|
| 📸 Ekran Analizi | Upload a FUT screenshot — Claude analyzes your squad/SBC/market and gives advice |
| 👥 Kadro Kur | Enter budget + preferences → Claude recommends an optimal squad with player names and prices |
| 🧩 SBC Çöz | Enter SBC requirements → Claude finds the cheapest solution |
| 📈 Market | Ask market questions; optional live player price lookup via fut.gg |

## Stack

- **Backend** — Python 3.11 · FastAPI · AsyncAnthropic (`claude-opus-4-7`)
- **Frontend** — React 18 · TypeScript · Vite (no UI library, plain CSS)
- **Live data** — fut.gg API via `curl_cffi` (Cloudflare bypass)
- **AI** — Claude Opus 4.7 with adaptive thinking for all 4 features + vision for screenshot analysis

## Setup

### 1. Clone

```bash
git clone https://github.com/beerbottle90/FUT-guide-26.git
cd FUT-guide-26
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # then fill in your Anthropic API key
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
# → http://localhost:8000
```

**`.env` keys:**

| Key | Where to get it |
|-----|----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `FUTDB_API_KEY` | not required (fut.gg is used instead) |

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Architecture

```
Browser (React + Vite :5173)
        │
        ▼
FastAPI (:8000)
├── POST /api/analyze        ← image + question → Claude Vision
├── POST /api/squad/build    ← budget + prefs   → Claude
├── POST /api/sbc/solve      ← requirements     → Claude
├── POST /api/market/advice  ← question         → fut.gg prices + Claude
└── GET  /api/market/player/{name}  ← live fut.gg search
```

## Live Data — fut.gg

Player prices are fetched from `https://www.fut.gg/api/fut/players/v2/26/` using `curl_cffi` with Chrome TLS impersonation. No API key required. The market tab shows real-time prices that Claude uses for advice.

## Version

`v0.0.1` — initial release

---

**Designer:** Ertuğ Demir · **Coded by:** [Claude Code](https://claude.ai/claude-code)

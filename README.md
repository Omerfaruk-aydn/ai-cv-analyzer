# 🤖 AI CV Analyzer

> Upload your CV and a job description — get an ATS match score, missing keywords, and actionable improvement suggestions powered by your preferred AI provider.

![Tech Stack](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

---

## 📁 Project Structure

```
ai-cv-analyzer/
├── backend/
│   ├── main.py          # FastAPI app & endpoints
│   ├── ai_provider.py   # Unified AI provider abstraction layer
│   ├── analyzer.py      # CV analysis logic
│   ├── cv_parser.py     # PDF text extraction (PyMuPDF)
│   ├── models.py        # Pydantic data models
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.jsx        # PDF upload + JD input
│   │   │   ├── ResultDashboard.jsx   # Score ring + results
│   │   │   └── ProviderSelector.jsx  # AI provider picker
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 PDF Upload | Drag-and-drop or browse for your CV (PDF only) |
| 💼 Job Description | Paste any job posting text |
| 🤖 Multi-Provider | Switch between 5 AI providers from the UI |
| 📊 Match Score | 0–100 ATS compatibility score with animated ring |
| 🏷️ Missing Keywords | Keywords in the JD that are absent in your CV |
| 💡 Suggestions | Numbered, actionable improvement tips |
| 🌗 Dark UI | Glassmorphism dark dashboard |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Configure

```bash
git clone https://github.com/your-username/ai-cv-analyzer.git
cd ai-cv-analyzer
```

Copy the environment file and fill in your API keys:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
AI_PROVIDER=openai          # Default provider (used when none is selected in UI)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
GROQ_API_KEY=gsk_...
MISTRAL_API_KEY=...
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

App available at: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker (Production)

```bash
# Build & run both services
docker-compose up --build

# App: http://localhost
# API: http://localhost:8000
```

---

## 🤖 AI Provider Setup

You only need to configure the providers you plan to use.
The UI lets you pick the provider per analysis; the `.env` file sets the default.

---

### 🟢 OpenAI — `gpt-4o`

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   ```
4. Install:
   ```bash
   pip install openai
   ```

---

### 🟠 Anthropic — `claude-sonnet-4-20250514`

1. Go to [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Generate an API key
3. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Install:
   ```bash
   pip install anthropic
   ```

---

### 🔵 Google — `gemini-1.5-pro`

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create an API key (free tier available)
3. Add to `.env`:
   ```env
   GOOGLE_API_KEY=AIza...
   ```
4. Install:
   ```bash
   pip install google-generativeai
   ```

---

### 🟣 Groq — `llama-3.3-70b-versatile` *(Free & Fast)*

1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Create an API key (free tier, very generous limits)
3. Add to `.env`:
   ```env
   GROQ_API_KEY=gsk_...
   ```
4. Install:
   ```bash
   pip install groq
   ```

> ✅ **Recommended for testing** — Groq is free, extremely fast (LPU inference), and requires no credit card.

---

### 🔴 Mistral — `mistral-large-latest`

1. Go to [https://console.mistral.ai/api-keys](https://console.mistral.ai/api-keys)
2. Generate an API key
3. Add to `.env`:
   ```env
   MISTRAL_API_KEY=...
   ```
4. Install:
   ```bash
   pip install mistralai
   ```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Upload CV + job description, get analysis |
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Interactive Swagger UI |

### `/analyze` — Request

```
Content-Type: multipart/form-data

file            (PDF file, required)
job_description (string, required)
provider        (string, optional: openai | anthropic | google | groq | mistral)
```

### `/analyze` — Response

```json
{
  "score": 72,
  "missing_keywords": ["Kubernetes", "CI/CD", "GraphQL"],
  "suggestions": [
    "Add a dedicated Skills section listing your cloud technologies.",
    "Quantify your achievements with metrics (e.g. 'reduced load time by 40%').",
    "Mention any open-source contributions or GitHub profile."
  ],
  "summary": "The candidate has solid Python and backend experience but lacks DevOps-related keywords critical for this role."
}
```

---

## ☁️ Deploy to Render

1. Push your repo to GitHub
2. Go to [https://render.com](https://render.com)
3. Create a **New Web Service** → select the repo → set root to `backend/`
4. Set environment variables from your `.env`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Create a **Static Site** for the frontend → root `frontend/` → build command `npm run build` → publish dir `dist`

---

## ☁️ Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up
```

Set environment variables in the Railway dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | FastAPI, Python 3.11 |
| PDF Parsing | PyMuPDF (fitz) |
| AI Providers | OpenAI, Anthropic, Google, Groq, Mistral |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx (frontend) |

---

## 📄 License

MIT — feel free to use, modify, and distribute.

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
from dotenv import load_dotenv

from models import AnalysisResult
from cv_parser import parse_pdf
from analyzer import analyze_cv

load_dotenv()

app = FastAPI(title="AI CV Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_endpoint(
    job_description: str = Form(...),
    provider: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        file_bytes = await file.read()
        cv_text = parse_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    if not cv_text:
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

    # Determine provider
    final_provider = provider if provider else os.getenv("AI_PROVIDER", "openai")
    final_provider = final_provider.lower()
    
    # Get API key for the selected provider
    api_key_env_var = f"{final_provider.upper()}_API_KEY"
    api_key = os.getenv(api_key_env_var)
    
    if not api_key:
        raise HTTPException(status_code=400, detail=f"API key not found for provider '{final_provider}'. Please set {api_key_env_var} in .env file or ensure the provider is supported.")

    try:
        result = analyze_cv(cv_text, job_description, final_provider, api_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

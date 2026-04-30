import json
from ai_provider import AIProvider
from models import AnalysisResult

def analyze_cv(cv_text: str, job_description: str, provider_name: str, api_key: str) -> AnalysisResult:
    system_prompt = """
You are an expert ATS (Applicant Tracking System) and HR professional.
Your task is to analyze a candidate's CV against a specific Job Description.

You MUST return your analysis as a JSON object with the following exact structure:
{
  "score": <integer between 0 and 100 representing the match percentage>,
  "missing_keywords": [<list of important keywords from the JD that are missing in the CV>],
  "suggestions": [<list of actionable suggestions to improve the CV for this specific role>],
  "summary": "<A short summary (2-3 sentences) evaluating the candidate's overall fit>"
}
"""
    user_prompt = f"--- JOB DESCRIPTION ---\n{job_description}\n\n--- CANDIDATE CV ---\n{cv_text}"
    
    ai = AIProvider(provider=provider_name, api_key=api_key)
    response_text = ai.complete(system=system_prompt, user=user_prompt)
    
    try:
        data = json.loads(response_text)
        return AnalysisResult(
            score=data.get("score", 0),
            missing_keywords=data.get("missing_keywords", []),
            suggestions=data.get("suggestions", []),
            summary=data.get("summary", "No summary provided.")
        )
    except json.JSONDecodeError:
        raise Exception(f"Failed to parse AI response as JSON. Raw output: {response_text}")

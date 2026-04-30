from pydantic import BaseModel
from typing import List, Optional

class AnalysisResult(BaseModel):
    score: int
    missing_keywords: List[str]
    suggestions: List[str]
    summary: str

class AnalyzeRequest(BaseModel):
    job_description: str
    provider: Optional[str] = None

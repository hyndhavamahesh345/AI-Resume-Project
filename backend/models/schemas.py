from pydantic import BaseModel, field_validator
from typing import List, Optional, Any

# --- Phase 1: Core Intelligence Outputs ---

def _coerce_to_list(v: Any) -> list:
    """Coerce None or empty string to [], pass through lists unchanged."""
    if v is None or v == "":
        return []
    if isinstance(v, str):
        # If the LLM returns a comma-separated string, split it
        return [item.strip() for item in v.split(',') if item.strip()]
    return v

class JobIntelligence(BaseModel):
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience: str = ""
    behavior_traits: List[str] = []

    @field_validator('required_skills', 'preferred_skills', 'behavior_traits', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

class ResumeIntelligence(BaseModel):
    name: str = ""
    skills: List[str] = []
    experience: List[str] = []
    projects: List[str] = []
    education: List[str] = []
    certifications: List[str] = []

    @field_validator('skills', 'experience', 'projects', 'education', 'certifications', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

# --- Phase 2: Matching Engine Outputs ---

class ATSScore(BaseModel):
    ats_score: int

class SemanticMatch(BaseModel):
    semantic_match: int

class SkillGap(BaseModel):
    matched: List[str] = []
    missing: List[str] = []

    @field_validator('matched', 'missing', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

class RecruiterView(BaseModel):
    recruiter_score: int
    technical_fit: str
    leadership: str
    communication: str
    recommendation: str

# --- Phase 3: Advisory Engine Outputs ---

class ResumeOptimization(BaseModel):
    optimization_score: int = 0
    suggestions: List[str] = []

    @field_validator('suggestions', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

class InterviewPrediction(BaseModel):
    interview_probability: str
    why: str

class CareerRoadmap(BaseModel):
    recommendations: List[str] = []

    @field_validator('recommendations', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

class LinkedInProfileOptimization(BaseModel):
    headline: str = ""
    about: str = ""
    experience: List[str] = []

    @field_validator('experience', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

# --- Final Composite Output ---

class FinalCandidateIntelligenceReport(BaseModel):
    candidate: str = ""
    ats_score: int = 0
    job_match_score: int = 0
    semantic_match: int = 0
    recruiter_score: int = 0
    interview_probability: str = ""
    missing_skills: List[str] = []
    strengths: List[str] = []
    recommendations: List[str] = []
    optimization_score: int = 0
    resume_edits: List[str] = []
    linkedin_headline: Optional[str] = None
    linkedin_about: Optional[str] = None
    linkedin_experience: Optional[List[str]] = None

    @field_validator('missing_skills', 'strengths', 'recommendations', 'resume_edits', mode='before')
    @classmethod
    def coerce_list_fields(cls, v):
        return _coerce_to_list(v)

# --- API Input Models ---

class ProcessCandidateRequest(BaseModel):
    job_description_text: str
    resume_text: str

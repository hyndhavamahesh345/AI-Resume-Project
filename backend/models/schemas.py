from pydantic import BaseModel
from typing import List, Optional

# --- Phase 1: Core Intelligence Outputs ---

class JobIntelligence(BaseModel):
    required_skills: List[str]
    preferred_skills: List[str]
    experience: str
    behavior_traits: List[str]

class ResumeIntelligence(BaseModel):
    name: str
    skills: List[str]
    experience: List[str]
    projects: List[str]
    education: List[str]
    certifications: List[str]

# --- Phase 2: Matching Engine Outputs ---

class ATSScore(BaseModel):
    ats_score: int

class SemanticMatch(BaseModel):
    semantic_match: int

class SkillGap(BaseModel):
    matched: List[str]
    missing: List[str]

class RecruiterView(BaseModel):
    recruiter_score: int
    technical_fit: str
    leadership: str
    communication: str
    recommendation: str

# --- Phase 3: Advisory Engine Outputs ---

class ResumeOptimization(BaseModel):
    optimization_score: int
    suggestions: List[str]

class InterviewPrediction(BaseModel):
    interview_probability: str
    why: str

class CareerRoadmap(BaseModel):
    recommendations: List[str]

class LinkedInProfileOptimization(BaseModel):
    headline: str
    about: str
    experience: List[str]

# --- Final Composite Output ---

class FinalCandidateIntelligenceReport(BaseModel):
    candidate: str
    ats_score: int
    job_match_score: int  # Derived from SkillGap
    semantic_match: int
    recruiter_score: int
    interview_probability: str
    missing_skills: List[str]
    strengths: List[str]
    recommendations: List[str]
    optimization_score: int
    resume_edits: List[str]
    linkedin_headline: Optional[str] = None
    linkedin_about: Optional[str] = None
    linkedin_experience: Optional[List[str]] = None

# --- API Input Models ---

class ProcessCandidateRequest(BaseModel):
    job_description_text: str
    resume_text: str

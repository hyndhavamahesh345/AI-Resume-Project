from langchain_groq import ChatGroq
from models.schemas import (
    ResumeIntelligence, 
    JobIntelligence, 
    SkillGap,
    RecruiterView, 
    ResumeOptimization, 
    InterviewPrediction, 
    CareerRoadmap
)

# Initialize the Groq LLM
# Using llama-3.3-70b-versatile for stable structured advisory output
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.2, # Slight creativity for advice
    max_tokens=2000
)

# Extractors with structured outputs
recruiter_view_chain = llm.with_structured_output(RecruiterView)
resume_optimizer_chain = llm.with_structured_output(ResumeOptimization)
interview_predictor_chain = llm.with_structured_output(InterviewPrediction)
career_roadmap_chain = llm.with_structured_output(CareerRoadmap)

def generate_recruiter_view(job_intel: JobIntelligence, resume_intel: ResumeIntelligence) -> RecruiterView:
    """Module 7: Recruiter View Engine"""
    prompt = f"""
    You are a Senior Technical Recruiter. Evaluate this candidate against the job description.
    
    Candidate Skills: {resume_intel.skills}
    Candidate Experience: {resume_intel.experience}
    
    Job Required Skills: {job_intel.required_skills}
    Job Preferred Skills: {job_intel.preferred_skills}
    
    Provide a holistic recruiter score (0-100) and brief string evaluations for technical fit, leadership, and communication, plus a final recommendation.
    """
    return recruiter_view_chain.invoke(prompt)

def optimize_resume(job_intel: JobIntelligence, resume_intel: ResumeIntelligence, skill_gap: SkillGap) -> ResumeOptimization:
    """Module 6: Resume Optimization Agent"""
    prompt = f"""
    You are an expert resume writer. The candidate is missing these skills: {skill_gap.missing}.
    Based on their current projects: {resume_intel.projects} and experience: {resume_intel.experience},
    provide an optimization score (0-100) on how well written the resume is, and 3-5 specific bullet-point suggestions to improve it organically.
    """
    return resume_optimizer_chain.invoke(prompt)

def predict_interview(recruiter_view: RecruiterView, skill_gap: SkillGap) -> InterviewPrediction:
    """Module 8: Interview Prediction Engine"""
    prompt = f"""
    Based on a recruiter score of {recruiter_view.recruiter_score}/100 and these missing skills: {skill_gap.missing},
    predict the probability (e.g., "82%") of this candidate getting an interview. 
    Explain why in 2-3 short sentences.
    """
    return interview_predictor_chain.invoke(prompt)

def generate_career_roadmap(job_intel: JobIntelligence, skill_gap: SkillGap) -> CareerRoadmap:
    """Module 9: Career Roadmap Generator"""
    prompt = f"""
    The candidate wants a role that requires: {job_intel.required_skills}.
    They are currently missing: {skill_gap.missing}.
    Generate a concise, actionable career roadmap (list of 3-4 steps like learning a specific tool or building a specific project) to bridge this gap.
    """
    return career_roadmap_chain.invoke(prompt)

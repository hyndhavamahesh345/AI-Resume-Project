from sentence_transformers import SentenceTransformer, util
from models.schemas import JobIntelligence, ResumeIntelligence, ATSScore, SemanticMatch, SkillGap
import numpy as np

# Initialize the embedding model globally so it's only loaded once.
# 'all-MiniLM-L6-v2' is small, fast, and excellent for semantic similarity.
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def compute_semantic_match(jd_text: str, resume_text: str) -> SemanticMatch:
    """
    Module 4: Semantic Match Engine
    Converts JD and Resume into vector embeddings and computes cosine similarity.
    """
    if not jd_text or not resume_text:
        return SemanticMatch(semantic_match=0)
        
    embeddings = embedder.encode([jd_text, resume_text], convert_to_tensor=True)
    cosine_score = util.cos_sim(embeddings[0], embeddings[1]).item()
    
    # Convert to 0-100 scale
    score = int(max(0.0, cosine_score) * 100)
    return SemanticMatch(semantic_match=score)


def analyze_skill_gap(job_intel: JobIntelligence, resume_intel: ResumeIntelligence) -> SkillGap:
    """
    Module 5: Skill Gap Analysis
    Compares extracted Job skills against extracted Resume skills.
    Performs case-insensitive matching.
    """
    jd_skills = set(skill.lower().strip() for skill in job_intel.required_skills + job_intel.preferred_skills)
    resume_skills = set(skill.lower().strip() for skill in resume_intel.skills)
    
    matched = []
    missing = []
    
    # We maintain original casing from the job description for the output
    all_jd_skills_original = job_intel.required_skills + job_intel.preferred_skills
    
    for original_skill in all_jd_skills_original:
        if original_skill.lower().strip() in resume_skills:
            matched.append(original_skill)
        else:
            missing.append(original_skill)
            
    return SkillGap(matched=matched, missing=missing)


def compute_ats_score(job_intel: JobIntelligence, resume_intel: ResumeIntelligence, skill_gap: SkillGap) -> ATSScore:
    """
    Module 3: ATS Score Engine
    A heuristic engine calculating a traditional keyword-based ATS score.
    Factors:
    - 60% Keyword match (Skill Gap)
    - 20% Experience alignment (Very basic proxy here)
    - 20% Structural presence (Are sections filled out?)
    """
    # 1. Keyword Score
    total_skills = len(skill_gap.matched) + len(skill_gap.missing)
    keyword_score = 0
    if total_skills > 0:
        keyword_score = (len(skill_gap.matched) / total_skills) * 60
        
    # 2. Structure Score
    structure_score = 0
    if resume_intel.experience: structure_score += 10
    if resume_intel.projects: structure_score += 5
    if resume_intel.education: structure_score += 5
    
    # 3. Experience Score (Simplified proxy: if experience exists, give 20)
    experience_score = 20 if len(resume_intel.experience) > 0 else 0
    
    final_score = int(keyword_score + structure_score + experience_score)
    # Cap at 100
    final_score = min(final_score, 100)
    
    return ATSScore(ats_score=final_score)

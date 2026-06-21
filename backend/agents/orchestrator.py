from models.schemas import FinalCandidateIntelligenceReport
from agents.extractors import extract_resume_intelligence, extract_job_intelligence
from agents.matching import compute_semantic_match, analyze_skill_gap, compute_ats_score
from agents.advisory import generate_recruiter_view, optimize_resume, predict_interview, generate_career_roadmap

def process_candidate(jd_text: str, resume_text: str) -> FinalCandidateIntelligenceReport:
    """
    Module 10: Candidate Ranking Engine (The Orchestrator)
    Runs all 9 modules to generate the final intelligence report.
    """
    # Phase 1: Core Extraction
    job_intel = extract_job_intelligence(jd_text)
    resume_intel = extract_resume_intelligence(resume_text)
    
    # Phase 2: Matching Engines
    semantic_match = compute_semantic_match(jd_text, resume_text)
    skill_gap = analyze_skill_gap(job_intel, resume_intel)
    ats_score = compute_ats_score(job_intel, resume_intel, skill_gap)
    recruiter_view = generate_recruiter_view(job_intel, resume_intel)
    
    # Phase 3: Advisory Engines
    resume_optimization = optimize_resume(job_intel, resume_intel, skill_gap)
    interview_prediction = predict_interview(recruiter_view, skill_gap)
    career_roadmap = generate_career_roadmap(job_intel, skill_gap)
    
    # Module 10: Final Hybrid Ranking Calculation
    # Formula: 0.25 * ATS + 0.35 * Semantic + 0.20 * Recruiter + 0.20 * Skill Match (Proxy for Experience/Project match)
    
    # Calculate Job Match Score (Percentage of matched skills)
    total_skills = len(skill_gap.matched) + len(skill_gap.missing)
    job_match_score = int((len(skill_gap.matched) / total_skills) * 100) if total_skills > 0 else 0
    
    final_score = (
        (0.25 * ats_score.ats_score) + 
        (0.35 * semantic_match.semantic_match) + 
        (0.20 * recruiter_view.recruiter_score) +
        (0.20 * job_match_score)
    )
    
    # Combine everything into the final report
    report = FinalCandidateIntelligenceReport(
        candidate=resume_intel.name,
        ats_score=ats_score.ats_score,
        job_match_score=job_match_score,
        semantic_match=semantic_match.semantic_match,
        recruiter_score=recruiter_view.recruiter_score,
        interview_probability=interview_prediction.interview_probability,
        missing_skills=skill_gap.missing,
        strengths=[
            f"Technical Fit: {recruiter_view.technical_fit}",
            f"Leadership: {recruiter_view.leadership}",
            f"Communication: {recruiter_view.communication}"
        ],
        recommendations=career_roadmap.recommendations,
        optimization_score=resume_optimization.optimization_score,
        resume_edits=resume_optimization.suggestions
    )    
    # In a real system, we'd also save the final_score somewhere for ranking, 
    # but it's part of the holistic evaluation.
    
    return report

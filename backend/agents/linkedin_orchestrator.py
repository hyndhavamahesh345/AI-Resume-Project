from models.schemas import FinalCandidateIntelligenceReport, ResumeIntelligence, JobIntelligence
from agents.extractors import extract_job_intelligence, extract_resume_intelligence
from agents.matching import compute_semantic_match, analyze_skill_gap, compute_ats_score
from agents.advisory import (
    generate_recruiter_view,
    optimize_resume,
    predict_interview,
    generate_career_roadmap,
    optimize_linkedin,
)


def simulate_linkedin_fetch(linkedin_url: str):
    """Simple mock fetch – extracts a name from the URL and returns a static profile.
    In production this would call a real LinkedIn API or scraper.
    """
    username = "Candidate"
    if "in/" in linkedin_url:
        username = (
            linkedin_url.split("in/")[-1]
            .strip("/")
            .split("?")[0]
            .replace("-", " ")
            .replace("_", " ")
            .title()
        )
    return {
        "name": username,
        "skills": ["React", "JavaScript", "TypeScript", "HTML/CSS", "Git", "Redux"],
        "experience": [
            "Frontend Engineer at InnovateTech (2024 - Present) - Building responsive React dashboards",
            "Software Intern at DevCorp (2023 - 2024) - Maintained component libraries and TypeScript files",
        ],
        "projects": ["Personal Developer Portfolio", "Interactive Task Scheduler App"],
        "education": ["B.S. in Computer Science"],
        "certifications": ["React Advanced Certification"],
    }


def process_linkedin(linkedin_url: str) -> FinalCandidateIntelligenceReport:
    """Process a LinkedIn‑only request and return a full intelligence report.
    The UI will typically use only the LinkedIn optimisation fields.
    """
    # 1. Simulate LinkedIn profile extraction
    profile = simulate_linkedin_fetch(linkedin_url)
    resume_intel = ResumeIntelligence(
        name=profile["name"],
        skills=profile["skills"],
        experience=profile["experience"],
        projects=profile["projects"],
        education=profile["education"],
        certifications=profile["certifications"],
    )

    # 2. Default job intelligence – generic Frontend React role
    job_intel = JobIntelligence(
        required_skills=["React", "TypeScript", "JavaScript", "CSS"],
        preferred_skills=["Next.js", "Tailwind CSS", "CI/CD"],
        experience="1-2 years",
        behavior_traits=["Problem Solving", "Collaboration"],
    )
    jd_text = "We are seeking a Frontend React Developer with experience in React, TypeScript, and CSS."

    # 3. Core metric calculations
    semantic_match = compute_semantic_match(jd_text, "")
    skill_gap = analyze_skill_gap(job_intel, resume_intel)
    ats_score = compute_ats_score(job_intel, resume_intel, skill_gap)
    recruiter_view = generate_recruiter_view(job_intel, resume_intel)

    # 4. Advisory engines
    resume_optimization = optimize_resume(job_intel, resume_intel, skill_gap)
    interview_prediction = predict_interview(recruiter_view, skill_gap)
    career_roadmap = generate_career_roadmap(job_intel, skill_gap)
    linkedin_optimization = optimize_linkedin(linkedin_url, job_intel, resume_intel)

    # 5. Job match score (percentage of matched skills)
    total_skills = len(skill_gap.matched) + len(skill_gap.missing)
    job_match_score = int((len(skill_gap.matched) / total_skills) * 100) if total_skills > 0 else 0

    # 6. Assemble final report
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
            f"Communication: {recruiter_view.communication}",
        ],
        recommendations=career_roadmap.recommendations,
        optimization_score=resume_optimization.optimization_score,
        resume_edits=resume_optimization.suggestions,
        linkedin_headline=linkedin_optimization.headline,
        linkedin_about=linkedin_optimization.about,
        linkedin_experience=linkedin_optimization.experience,
    )
    return report

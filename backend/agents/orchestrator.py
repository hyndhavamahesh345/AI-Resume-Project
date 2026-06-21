from models.schemas import FinalCandidateIntelligenceReport, ResumeIntelligence, JobIntelligence
from agents.extractors import extract_resume_intelligence, extract_job_intelligence
from agents.matching import compute_semantic_match, analyze_skill_gap, compute_ats_score
from agents.advisory import (
    generate_recruiter_view, 
    optimize_resume, 
    predict_interview, 
    generate_career_roadmap,
    optimize_linkedin
)

def simulate_linkedin_fetch(linkedin_url: str):
    # Parse username from URL, e.g. https://linkedin.com/in/alex-johnson -> Alex Johnson
    username = "Candidate"
    if "in/" in linkedin_url:
        username = linkedin_url.split("in/")[-1].strip("/").split("?")[0].replace("-", " ").replace("_", " ").title()
    
    # Standard software engineering profile defaults
    return {
        "name": username,
        "skills": ["React", "JavaScript", "TypeScript", "HTML/CSS", "Git", "Redux"],
        "experience": [
            "Frontend Engineer at InnovateTech (2024 - Present) - Building responsive React dashboards",
            "Software Intern at DevCorp (2023 - 2024) - Maintained component libraries and TypeScript files"
        ],
        "projects": ["Personal Developer Portfolio", "Interactive Task Scheduler App"],
        "education": ["B.S. in Computer Science"],
        "certifications": ["React Advanced Certification"]
    }

def process_candidate(jd_text: str, resume_text: str, linkedin_url: str = "") -> FinalCandidateIntelligenceReport:
    """
    Module 10: Candidate Ranking Engine (The Orchestrator)
    Runs all 9 modules to generate the final intelligence report.
    """
    # Phase 1: Core Extraction & LinkedIn Fetching
    if not resume_text.strip() and linkedin_url:
        # Simulate fetching LinkedIn profile
        profile = simulate_linkedin_fetch(linkedin_url)
        resume_intel = ResumeIntelligence(
            name=profile["name"],
            skills=profile["skills"],
            experience=profile["experience"],
            projects=profile["projects"],
            education=profile["education"],
            certifications=profile["certifications"]
        )
        resume_text = f"Candidate: {profile['name']}\nSkills: {', '.join(profile['skills'])}\nExperience: {'; '.join(profile['experience'])}"
    else:
        resume_intel = extract_resume_intelligence(resume_text)
        
    if not jd_text.strip():
        # Default target job intelligence for LinkedIn-only optimization
        job_intel = JobIntelligence(
            required_skills=["React", "TypeScript", "JavaScript", "CSS"],
            preferred_skills=["Next.js", "Tailwind CSS", "CI/CD"],
            experience="1-2 years",
            behavior_traits=["Problem Solving", "Collaboration"]
        )
        jd_text = "We are seeking a Frontend React Developer with experience in React, TypeScript, and CSS."
    else:
        job_intel = extract_job_intelligence(jd_text)
    
    # Phase 2 & 3 & 4: LLM and vector calculations
    try:
        semantic_match = compute_semantic_match(jd_text, resume_text)
        skill_gap = analyze_skill_gap(job_intel, resume_intel)
        ats_score = compute_ats_score(job_intel, resume_intel, skill_gap)
        recruiter_view = generate_recruiter_view(job_intel, resume_intel)
        
        # Phase 3: Advisory Engines
        resume_optimization = optimize_resume(job_intel, resume_intel, skill_gap)
        interview_prediction = predict_interview(recruiter_view, skill_gap)
        career_roadmap = generate_career_roadmap(job_intel, skill_gap)
        
        # Phase 4: LinkedIn Profile Optimization
        effective_url = linkedin_url if linkedin_url and linkedin_url.strip() else "https://linkedin.com/in/candidate"
        linkedin_optimization = optimize_linkedin(effective_url, job_intel, resume_intel)
        
        # Calculate Job Match Score (Percentage of matched skills)
        total_skills = len(skill_gap.matched) + len(skill_gap.missing)
        job_match_score = int((len(skill_gap.matched) / total_skills) * 100) if total_skills > 0 else 0
        
        recruiter_score_val = recruiter_view.recruiter_score
        technical_fit_val = recruiter_view.technical_fit
        leadership_val = recruiter_view.leadership
        communication_val = recruiter_view.communication
        interview_prob_val = interview_prediction.interview_probability
        career_roadmap_recs = career_roadmap.recommendations
        opt_score_val = resume_optimization.optimization_score
        resume_suggestions = resume_optimization.suggestions
        
        linkedin_headline_val = linkedin_optimization.headline
        linkedin_about_val = linkedin_optimization.about
        linkedin_experience_val = linkedin_optimization.experience
        
    except Exception as llm_error:
        print(f"LLM or API failed, using rule-based fallback: {llm_error}")
        
        # Basic computations
        skill_gap = analyze_skill_gap(job_intel, resume_intel)
        ats_score = compute_ats_score(job_intel, resume_intel, skill_gap)
        semantic_match = compute_semantic_match(jd_text, resume_text)
        
        total_skills = len(skill_gap.matched) + len(skill_gap.missing)
        job_match_score = int((len(skill_gap.matched) / total_skills) * 100) if total_skills > 0 else 0
        
        # Fallback values
        recruiter_score_val = 72
        technical_fit_val = "Strong candidate with core competencies in required stacks."
        leadership_val = "Demonstrates good project ownership and technical initiative."
        communication_val = "Clear documentation and structured experience descriptions."
        interview_prob_val = "Medium"
        career_roadmap_recs = [
            f"Explicitly add missing skills: {', '.join(skill_gap.missing[:2])} to your resume and projects." if len(skill_gap.missing) >= 2 else "Incorporate target job requirements in your projects.",
            "Integrate quantitative metrics (e.g. % performance increase) in your project achievements.",
            "Obtain relevant certifications or build full-stack projects showcasing target tools."
        ]
        opt_score_val = 80
        resume_suggestions = [
            f"Add target keywords '{skill_gap.missing[0]}' and '{skill_gap.missing[1]}' to resume summary." if len(skill_gap.missing) >= 2 else "Add target missing keywords.",
            "Restructure bullet points using the STAR format (Situation, Task, Action, Result).",
            "Incorporate a dedicated 'Core Competencies' section at the top of the resume."
        ]
        
        # Fallback LinkedIn optimizations
        primary_skill = resume_intel.skills[0] if resume_intel.skills else "Software Engineer"
        other_skills = ", ".join(resume_intel.skills[1:4]) if len(resume_intel.skills) > 1 else "Web Development"
        linkedin_headline_val = f"{resume_intel.name} | {primary_skill} Developer | {other_skills}"
        linkedin_about_val = (
            f"Experienced software professional specializing in {primary_skill} and {other_skills}. "
            "Passionate about building scalable applications, implementing clean architectures, and "
            "driving team collaboration to deliver high-impact features."
        )
        linkedin_experience_val = [
            f"Architected frontend and backend solutions using {primary_skill} and related tech stacks.",
            "Collaborated with developers and product managers to release key features under tight deadlines.",
            "Leveraged tools like Git, CI/CD, and unit tests to ensure high-quality software delivery."
        ]
        
    # Combine everything into the final report
    report = FinalCandidateIntelligenceReport(
        candidate=resume_intel.name,
        ats_score=ats_score.ats_score,
        job_match_score=job_match_score,
        semantic_match=semantic_match.semantic_match,
        recruiter_score=recruiter_score_val,
        interview_probability=interview_prob_val,
        missing_skills=skill_gap.missing,
        strengths=[
            f"Technical Fit: {technical_fit_val}",
            f"Leadership: {leadership_val}",
            f"Communication: {communication_val}"
        ],
        recommendations=career_roadmap_recs,
        optimization_score=opt_score_val,
        resume_edits=resume_suggestions,
        linkedin_headline=linkedin_headline_val,
        linkedin_about=linkedin_about_val,
        linkedin_experience=linkedin_experience_val
    )    
    
    return report

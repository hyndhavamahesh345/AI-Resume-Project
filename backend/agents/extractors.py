from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from models.schemas import ResumeIntelligence, JobIntelligence
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize the Groq LLM (we assume GROQ_API_KEY is in the environment)
# Using llama-3.3-70b-versatile for stable structured extraction
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    max_tokens=2000
)

# Create structured output chains
resume_extractor = llm.with_structured_output(ResumeIntelligence)
job_extractor = llm.with_structured_output(JobIntelligence)

def extract_resume_intelligence(resume_text: str) -> ResumeIntelligence:
    """
    Module 1: Resume Intelligence Engine
    Extracts structured data from raw resume text.
    """
    prompt = f"""
    You are an expert technical recruiter. Analyze the following resume text 
    and extract the structured information requested. 
    Be thorough and precise.
    
    Resume Text:
    {resume_text}
    """
    # Invoke the structured chain
    result = resume_extractor.invoke(prompt)
    return result


def extract_job_intelligence(jd_text: str) -> JobIntelligence:
    """
    Module 2: Job Intelligence Engine
    Extracts structured requirements from raw job description text.
    """
    prompt = f"""
    You are an expert technical recruiter. Analyze the following Job Description 
    and extract the structured requirements requested.
    Distinguish clearly between required and preferred skills.
    
    Job Description:
    {jd_text}
    """
    # Invoke the structured chain
    result = job_extractor.invoke(prompt)
    return result

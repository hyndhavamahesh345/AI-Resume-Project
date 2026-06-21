from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import fitz  # PyMuPDF
from models.schemas import FinalCandidateIntelligenceReport
from agents.orchestrator import process_candidate

app = FastAPI(title="AI ATS Resume Backend", version="1.0.0")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI ATS Resume Backend is running!"}

@app.post("/api/v1/analyze", response_model=FinalCandidateIntelligenceReport)
async def analyze_candidate(
    resume: Optional[UploadFile] = File(None),
    jobDescription: Optional[str] = Form(None),
    linkedinUrl: Optional[str] = Form(None)
):
    """
    This endpoint takes an optional Job Description, an optional Resume (as PDF),
    and an optional LinkedIn URL, and orchestrates the 10-module intelligence
    pipeline to generate the final Candidate Intelligence Report.
    """
    try:
        resume_text = ""
        if resume is not None:
            # Extract text from the uploaded PDF
            resume_bytes = await resume.read()
            
            # We assume it's a PDF. Fallback logic could be added for DOCX.
            try:
                doc = fitz.open(stream=resume_bytes, filetype="pdf")
                for page in doc:
                    resume_text += page.get_text()
            except Exception as pdf_error:
                # If it's a raw text mock fallback or fails parsing
                resume_text = resume_bytes.decode('utf-8', errors='ignore')

        # Run the 10-module orchestrator
        report = process_candidate(jobDescription or "", resume_text, linkedinUrl or "")
        return report
        
    except Exception as e:
        print(f"Error processing candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

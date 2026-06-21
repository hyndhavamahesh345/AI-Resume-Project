"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResultsView from '../../components/ResultsView';

const DEMOS = [
  {
    jd: "We are looking for a Frontend React Developer with 1-2 years of experience. Must know React, Tailwind CSS, and Next.js. You will be building responsive user interfaces and integrating with REST APIs.",
    fileName: "Alex_Johnson_Resume_Bootcamp.pdf"
  },
  {
    jd: "Seeking a Junior Node.js Backend Engineer. Responsibilities include building scalable microservices, managing MongoDB databases, and writing Express.js routes.",
    fileName: "Jamie_Smith_Backend_Resume.pdf"
  },
  {
    jd: "Data Engineer position available. We need a Python expert who can handle ETL pipelines, work with Pandas, and query large SQL databases efficiently.",
    fileName: "Taylor_Reed_Data_Engineer.pdf"
  }
];

const PIPELINE_STEPS = [
  "Job Match Intelligence",
  "Candidate Intelligence Report",
  "AI Career Copilot"
];

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Form State
  const [resumeFile, setResumeFile] = useState<File | { name: string } | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState<number[]>([0, 0, 0]);
  const [isComplete, setIsComplete] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);

  const resetForm = () => {
    setIsComplete(false);
    setIsProcessing(false);
    setProcessingStep(0);
    setElapsedTimes([0, 0, 0]);
    setResultsData(null);
    setResumeFile(null);
    setJobDescription("");
    setLinkedinUrl("");
  };

  // Timer for active processing step
  useEffect(() => {
    if (!isProcessing || processingStep < 1 || processingStep > 3) return;
    const interval = setInterval(() => {
      setElapsedTimes(prev => {
        const next = [...prev];
        next[processingStep - 1] += 0.1;
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isProcessing, processingStep]);

  useEffect(() => {
    if (processingStep > 3 && resultsData && !resultsData.error) {
      setIsComplete(true);
    }
  }, [processingStep, resultsData]);

  const handleDemoClick = (index: number) => {
    const demo = DEMOS[index];
    setResumeFile({ name: demo.fileName });
    setJobDescription(demo.jd);
    // Removed auto-start. User must click "Analyze my application" manually.
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setProcessingStep(1);
    setElapsedTimes([0, 0, 0]);
    setResultsData(null);

    // Start timer sequence
    let time = 0;
    setTimeout(() => setProcessingStep(2), time += 3700); 
    setTimeout(() => setProcessingStep(3), time += 8000); 
    setTimeout(() => setProcessingStep(4), time += 4000);  

    const formData = new FormData();
    if (resumeFile instanceof File) {
      formData.append('resume', resumeFile);
    } else if (resumeFile && typeof resumeFile === 'object' && 'name' in resumeFile) {
      const blob = new Blob(["Mock PDF content. React, Typescript."], { type: 'application/pdf' });
      formData.append('resume', blob, (resumeFile as any).name || 'mock.pdf');
    }
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }
    if (linkedinUrl) {
      formData.append('linkedinUrl', linkedinUrl);
    }

    try {
      // Connect to the new Python FastAPI backend (Module 10 Orchestrator)
      const res = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API failed: ${errText}`);
      }
      const data = await res.json();
      setResultsData(data);
    } catch (e) {
      console.error(e);
      // Pass an error object instead of empty object to prevent ResultsView from crashing
      setResultsData({ error: true });
    }
  };

  const isFormFilled = resumeFile && jobDescription.length > 50;

  return (
    <>
      {/* Main App Container */}
      <div className="min-h-screen bg-primary flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-border h-14 px-8 flex items-center justify-between shrink-0">
          <Link href="/" className="font-serif text-lg tracking-[0.1em] text-text-primary hover:opacity-80 transition-opacity">
            AI ATS RESUME
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#how-it-works" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
              About →
            </Link>
            <Link href="/linkedin" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
              LinkedIn Opt →
            </Link>
          </div>
        </nav>

        {/* Main Content Split */}
        <main className="flex flex-1 overflow-hidden relative">
          
          {/* Left Pane */}
          {!isProcessing && !isComplete && (
            <div className="w-[400px] shrink-0 bg-secondary border-r border-border p-12 relative overflow-hidden flex flex-col">
            <div className="absolute -bottom-5 -right-10 w-[200px] h-[300px] border border-border rounded-t-[100px] opacity-60 pointer-events-none" />

            <div className="relative z-10">
              <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-8">
                AI ATS Resume Pipeline
              </p>
              <h1 className="font-serif text-[52px] font-light text-text-primary leading-[1.05] mb-0 animate-fade-up">
                Match the role.
              </h1>
              <h1 className="font-serif text-[52px] font-light italic text-text-muted leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: '150ms' }}>
                Prove the capability.
              </h1>
              <p className="font-sans text-xs font-light text-text-muted leading-[1.8] max-w-[300px] mb-12">
                Upload a resume, paste a job description, and get a complete application package in under two minutes.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { num: "01", title: "Job Match Intelligence", desc: "AI understands the role requirements and evaluates your profile using semantic matching and recruiter-grade scoring." },
                  { num: "02", title: "Candidate Intelligence Report", desc: "Receive ATS score, skill-gap analysis, recruiter insights, strengths, weaknesses, and interview probability." },
                  { num: "03", title: "AI Career Copilot", desc: "Optimize your resume, generate tailored applications, and get personalized recommendations to land more interviews." }
                ].map((step, idx) => {
                  // Highlight the current step if processing
                  let currentLeftPaneStep = 0;
                  if (processingStep === 1) currentLeftPaneStep = 1;
                  else if (processingStep === 2) currentLeftPaneStep = 2;
                  else if (processingStep === 3) currentLeftPaneStep = 3;
                  else if (processingStep > 3) currentLeftPaneStep = 4;

                  const isCurrentStep = isProcessing && currentLeftPaneStep === idx + 1;
                  const isCompleted = isProcessing && currentLeftPaneStep > idx + 1;
                  
                  return (
                    <div key={idx} className={`flex gap-5 transition-opacity duration-500 ${isProcessing && !isCurrentStep && !isCompleted ? 'opacity-30' : 'opacity-100'}`}>
                      <span className={`font-serif text-[28px] shrink-0 leading-[1.1] transition-colors ${isCurrentStep ? 'text-text-primary font-medium' : 'font-light text-accent-dark'}`}>
                        {isCompleted ? "✓" : step.num}
                      </span>
                      <div>
                        <p className={`font-sans text-[13px] mb-1 transition-colors ${isCurrentStep ? 'text-text-primary font-bold' : 'font-medium text-text-secondary'}`}>
                          {step.title}
                        </p>
                        <p className="font-sans text-[11px] font-light text-text-muted leading-[1.6]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Right Pane (Form, Processing Screen, or Results) */}
          <div className="flex-1 overflow-y-auto p-12 relative flex justify-center">
            
            {isComplete ? (
              <ResultsView onStartOver={resetForm} data={resultsData} />
            ) : isProcessing ? (
              <div className="w-full max-w-2xl mt-4 animate-fade-in">
                <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-4">
                  Pipeline Running
                </p>
                <h2 className="font-serif text-[48px] font-light text-text-primary mb-2 leading-none">
                  Building your package
                </h2>
                <p className="font-sans text-[13px] font-light text-text-muted mb-12">
                  Typically 15–20 seconds — all three stages run sequentially.
                </p>

                <div className="border border-border p-10 mb-8 flex flex-col gap-7">
                  {PIPELINE_STEPS.map((stepName, idx) => {
                    const stepNum = idx + 1;
                    const isActive = processingStep === stepNum;
                    const isDone = processingStep > stepNum;
                    const isPending = processingStep < stepNum;
                    
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <span className={`font-serif text-[26px] leading-none ${isPending ? 'text-border font-light' : 'text-text-primary font-light'}`}>
                            0{stepNum}
                          </span>
                          <span className={`font-sans text-[14px] ${isPending ? 'text-text-muted font-light' : isDone ? 'text-text-secondary font-light' : 'text-text-primary font-normal'}`}>
                            {stepName}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-end w-24">
                          {isDone && (
                            stepName === "Deploying to Vercel" ? (
                              <span className="font-sans text-[12px] font-light text-text-primary flex items-center justify-end gap-1.5 w-full">
                                {elapsedTimes[idx].toFixed(1)}s <span className="text-[10px] mt-[1px] text-accent-dark font-bold">!</span>
                              </span>
                            ) : (
                              <span className="font-sans text-[12px] font-light text-text-muted flex items-center justify-end gap-1.5 w-full">
                                {elapsedTimes[idx].toFixed(1)}s <span className="text-[10px] mt-[1px] text-text-secondary">✓</span>
                              </span>
                            )
                          )}
                          {isActive && (
                            <span className="font-sans text-[12px] font-light text-text-primary flex items-center justify-end gap-3 w-full">
                              {elapsedTimes[idx].toFixed(1)}s
                              <div className="pulse-dot"></div>
                            </span>
                          )}
                          {isPending && (
                            <div className="w-2 h-2 bg-border rounded-full opacity-100"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center mt-12">
                  {processingStep > 3 && resultsData ? (
                    resultsData.error ? (
                      <button 
                        onClick={resetForm}
                        className="bg-red-900 text-white py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity"
                      >
                        Analysis Failed - Try Again
                      </button>
                    ) : null
                  ) : (
                    <p className="font-sans text-[11px] font-medium text-text-primary">
                      Do not close this tab.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl animate-fade-in">
                <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-3">
                  Pipeline
                </p>
                <h2 className="font-serif text-4xl font-light text-text-primary mb-10">
                  Start your application
                </h2>

                <div className="flex flex-col gap-8">
                  
                  {/* Demos */}
                  <div>
                    <p className="font-sans text-[9px] font-medium tracking-[0.2em] uppercase text-text-muted mb-2.5">
                      Try a demo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Demo 1 · Bootcamp → React Frontend", "Demo 2 · Junior Dev → Node.js Backend", "Demo 3 · CS Grad → Python Data Engineer"].map((demo, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleDemoClick(i)}
                          className="bg-secondary border border-border text-text-muted font-sans text-[10px] py-2 px-4 hover:bg-primary hover:text-accent-dark transition-colors tracking-[0.05em]"
                        >
                          {demo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. Resume */}
                  <div>
                    <label className="font-sans text-xs font-medium text-text-secondary block mb-2 tracking-[0.02em]">
                      1. Resume <span className="text-text-muted font-light ml-1">PDF or DOCX</span>
                    </label>
                    <label className="flex flex-col items-center justify-center border border-dashed border-accent-dark bg-secondary py-8 px-4 cursor-pointer hover:bg-opacity-80 transition-colors">
                      {resumeFile ? (
                        <span className="font-sans text-[13px] font-medium text-accent-dark">
                          ✓ {resumeFile.name}
                        </span>
                      ) : (
                        <>
                          <span className="font-sans text-[13px] font-light text-text-muted">
                            Drop PDF or DOCX here, or <span className="text-text-secondary font-normal">browse</span>
                          </span>
                          <span className="font-sans text-[11px] text-text-muted mt-1">Up to 10 MB</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setResumeFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                  </div>

                  {/* 2. Job description */}
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <label htmlFor="jd" className="font-sans text-xs font-medium text-text-secondary tracking-[0.02em]">
                        2. Job description
                      </label>
                      <span className="font-sans text-[11px] text-text-muted">
                        {Math.max(0, 50 - jobDescription.length)} more chars needed
                      </span>
                    </div>
                    <textarea 
                      id="jd"
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description here..."
                      className="w-full bg-secondary border border-border text-text-primary p-3 font-sans text-sm outline-none focus:border-accent-dark resize-y leading-[1.6] transition-colors"
                    />
                  </div>


                  </div>

                  {/* Submit */}
                  <button 
                    type="button"
                    onClick={startProcessing}
                    disabled={!isFormFilled}
                    className={`w-full py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase mt-2 transition-colors ${
                      isFormFilled 
                        ? 'bg-accent-dark text-primary hover:opacity-90 cursor-pointer' 
                        : 'bg-border text-text-muted cursor-not-allowed'
                    }`}
                  >
                    Analyze my application
                  </button>

                </div>

            )}

          </div>

        </main>
      </div>
    </>
  );
}

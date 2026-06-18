"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResultsView from '../components/ResultsView';

const DEMOS = [
  {
    name: "Alex Johnson",
    company: "TechFlow Inc.",
    recruiter: "Sarah Miller",
    jd: "We are looking for a Frontend React Developer with 1-2 years of experience. Must know React, Tailwind CSS, and Next.js. You will be building responsive user interfaces and integrating with REST APIs.",
    fileName: "Alex_Johnson_Resume_Bootcamp.pdf"
  },
  {
    name: "Jamie Smith",
    company: "CloudCore",
    recruiter: "David Chen",
    jd: "Seeking a Junior Node.js Backend Engineer. Responsibilities include building scalable microservices, managing MongoDB databases, and writing Express.js routes.",
    fileName: "Jamie_Smith_Backend_Resume.pdf"
  },
  {
    name: "Taylor Reed",
    company: "DataSync",
    recruiter: "Emily Wong",
    jd: "Data Engineer position available. We need a Python expert who can handle ETL pipelines, work with Pandas, and query large SQL databases efficiently.",
    fileName: "Taylor_Reed_Data_Engineer.pdf"
  }
];

const PIPELINE_STEPS = [
  "Analyzing job description",
  "Generating project",
  "Deploying to Vercel",
  "Rebuilding resume",
  "Writing outreach copy"
];

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Form State
  const [resumeFile, setResumeFile] = useState<File | { name: string } | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [company, setCompany] = useState("");
  const [recruiter, setRecruiter] = useState("");

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isComplete, setIsComplete] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);

  const resetForm = () => {
    setIsComplete(false);
    setIsProcessing(false);
    setProcessingStep(0);
    setElapsedTimes([0, 0, 0, 0, 0]);
    setResultsData(null);
    setResumeFile(null);
    setJobDescription("");
    setApplicantName("");
    setCompany("");
    setRecruiter("");
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  // Timer for active processing step
  useEffect(() => {
    if (!isProcessing || processingStep < 1 || processingStep > 5) return;
    const interval = setInterval(() => {
      setElapsedTimes(prev => {
        const next = [...prev];
        next[processingStep - 1] += 0.1;
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isProcessing, processingStep]);



  const handleDemoClick = (index: number) => {
    const demo = DEMOS[index];
    setResumeFile({ name: demo.fileName });
    setJobDescription(demo.jd);
    setApplicantName(demo.name);
    setCompany(demo.company);
    setRecruiter(demo.recruiter);
    // Removed auto-start. User must click "Analyze my application" manually.
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setProcessingStep(1);
    setElapsedTimes([0, 0, 0, 0, 0]);
    setResultsData(null);

    // Start timer sequence
    let time = 0;
    setTimeout(() => setProcessingStep(2), time += 3700); 
    setTimeout(() => setProcessingStep(3), time += 15200); 
    setTimeout(() => setProcessingStep(4), time += 8000);  
    setTimeout(() => setProcessingStep(5), time += 6000);  
    setTimeout(() => setProcessingStep(6), time += 4000);  

    const formData = new FormData();
    if (resumeFile instanceof File) {
      formData.append('resume', resumeFile);
    } else {
      const blob = new Blob(["Mock PDF content. React, Typescript."], { type: 'application/pdf' });
      formData.append('resume', blob, (resumeFile as any)?.name || 'mock.pdf');
    }
    formData.append('jobDescription', jobDescription);
    formData.append('applicantName', applicantName);
    formData.append('company', company);
    formData.append('recruiter', recruiter);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setResultsData(data);
    } catch (e) {
      console.error(e);
      // Pass an error object instead of empty object to prevent ResultsView from crashing
      setResultsData({ error: true });
    }
  };

  const isFormFilled = resumeFile && jobDescription.length > 50 && applicantName;

  return (
    <>
      {/* Splash Screen Animation Overlay */}
      {showSplash && (
        <div 
          className="fixed inset-0 bg-primary z-[9999] flex flex-col items-center justify-center pointer-events-none"
          style={{ animation: 'fadeOut 0.5s ease 2.3s forwards' }}
        >
          <div className="flex items-baseline gap-0">
            <span 
              className="font-serif text-[96px] font-light text-text-primary leading-none opacity-0"
              style={{ animation: 'fadeIn 0.8s ease 0.2s forwards' }}
            >
              RESUME
            </span>
            <span 
              className="font-serif text-[96px] font-light text-accent-dark leading-none ml-[2px] opacity-0"
              style={{ animation: 'fadeIn 0.8s ease 0.6s forwards' }}
            >
              PROJECT
            </span>
          </div>
          <div 
            className="mt-5 h-[1px] bg-border opacity-0 w-0"
            style={{ animation: 'expandLine 0.8s ease 1.0s forwards' }}
          ></div>
          <p 
            className="font-sans text-[11px] font-light text-text-muted tracking-[0.2em] uppercase mt-5 opacity-0"
            style={{ animation: 'fadeIn 0.8s ease 1.4s forwards' }}
          >
            Match the role. Prove the capability.
          </p>
        </div>
      )}

      {/* Main App Container */}
      <div 
        className="min-h-screen bg-primary flex flex-col opacity-0"
        style={{ animation: 'fadeIn 0.8s ease 2.4s forwards' }}
      >
        {/* Navigation */}
        <nav className="border-b border-border h-14 px-8 flex items-center justify-between shrink-0">
          <span className="font-serif text-lg tracking-[0.1em] text-text-primary">
            RESUME PROJECT
          </span>
          <div className="flex items-center gap-6">
            <Link href="/about#how-it-works" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
              About →
            </Link>
          </div>
        </nav>

        {/* Main Content Split */}
        <main className="flex flex-1 overflow-hidden relative">
          
          {/* Left Pane */}
          <div className="w-[400px] shrink-0 bg-secondary border-r border-border p-12 relative overflow-hidden flex flex-col">
            <div className="absolute -bottom-5 -right-10 w-[200px] h-[300px] border border-border rounded-t-[100px] opacity-60 pointer-events-none" />

            <div className="relative z-10">
              <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-8">
                Resume Project Pipeline
              </p>
              <h1 className="font-serif text-[52px] font-light text-text-primary leading-[1.05] mb-0">
                Match the role.
              </h1>
              <h1 className="font-serif text-[52px] font-light italic text-text-muted leading-[1.05] mb-6">
                Prove the capability.
              </h1>
              <p className="font-sans text-xs font-light text-text-muted leading-[1.8] max-w-[300px] mb-12">
                Upload a resume, paste a job description, and get a complete application package in under two minutes.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { num: "01", title: "JD analysis", desc: "AI extracts required skills, exact keywords, and role context from the job description." },
                  { num: "02", title: "Code generation + deploy", desc: "Codex builds a role-specific proof-of-work project and deploys it live to Vercel." },
                  { num: "03", title: "Resume reconstruction", desc: "Resume experience is remapped to JD language — no fabrication, only realignment." },
                  { num: "04", title: "Outreach copy", desc: "AI writes a cover letter and recruiter message that reference the live project URL." }
                ].map((step, idx) => {
                  // Highlight the current step if processing
                  // The left pane has 4 steps, but our right pane pipeline has 5. We'll map them loosely.
                  let currentLeftPaneStep = 0;
                  if (processingStep === 1) currentLeftPaneStep = 1;
                  else if (processingStep === 2 || processingStep === 3) currentLeftPaneStep = 2;
                  else if (processingStep === 4) currentLeftPaneStep = 3;
                  else if (processingStep === 5) currentLeftPaneStep = 4;
                  else if (processingStep > 5) currentLeftPaneStep = 5;

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
                  Typically 60–90 seconds — all five stages run sequentially.
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
                  {processingStep > 5 && resultsData ? (
                    resultsData.error ? (
                      <button 
                        onClick={resetForm}
                        className="bg-red-900 text-white py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity"
                      >
                        Analysis Failed - Try Again
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsComplete(true)}
                        className="bg-accent-dark text-primary py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity"
                      >
                        View Package →
                      </button>
                    )
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

                    {/* Optional Contact Details Toggle */}
                    <div className="mt-3">
                      <button 
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className="flex items-center gap-2 font-sans text-xs font-medium text-text-secondary tracking-[0.02em]"
                      >
                        <span className="text-text-muted w-3">{isContactOpen ? '▾' : '▸'}</span>
                        Contact details (optional)
                      </button>
                      {isContactOpen && (
                        <div className="grid grid-cols-2 gap-3 pt-3 animate-fade-up">
                          {[
                            { id: "email", label: "Email", placeholder: "e.g. name@email.com" },
                            { id: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
                            { id: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/yourname" },
                            { id: "github", label: "GitHub", placeholder: "github.com/yourname" },
                            { id: "website", label: "Website", placeholder: "yourportfolio.com" },
                            { id: "location", label: "Location", placeholder: "City, State" }
                          ].map((field) => (
                            <div key={field.id}>
                              <label htmlFor={field.id} className="font-sans text-xs font-medium text-text-secondary block mb-2 tracking-[0.02em]">
                                {field.label}
                              </label>
                              <input 
                                id={field.id}
                                type="text"
                                placeholder={field.placeholder}
                                className="w-full bg-secondary border border-border text-text-primary p-3 font-sans text-sm outline-none focus:border-accent-dark transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

                  {/* 3. Your name */}
                  <div>
                    <label htmlFor="name" className="font-sans text-xs font-medium text-text-secondary block mb-2 tracking-[0.02em]">
                      3. Your name
                    </label>
                    <input 
                      id="name"
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Full name (used in cover letter and outreach)"
                      className="w-full bg-secondary border border-border text-text-primary p-3 font-sans text-sm outline-none focus:border-accent-dark transition-colors"
                    />
                  </div>

                  {/* 4. Target company */}
                  <div>
                    <label htmlFor="company" className="font-sans text-xs font-medium text-text-secondary block mb-2 tracking-[0.02em]">
                      4. Target company <span className="text-text-muted font-light ml-1">optional</span>
                    </label>
                    <input 
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Stripe, Figma"
                      className="w-full bg-secondary border border-border text-text-primary p-3 font-sans text-sm outline-none focus:border-accent-dark transition-colors"
                    />
                  </div>

                  {/* 5. Recruiter name */}
                  <div>
                    <label htmlFor="recruiter" className="font-sans text-xs font-medium text-text-secondary block mb-2 tracking-[0.02em]">
                      5. Recruiter name <span className="text-text-muted font-light ml-1">optional</span>
                    </label>
                    <input 
                      id="recruiter"
                      type="text"
                      value={recruiter}
                      onChange={(e) => setRecruiter(e.target.value)}
                      placeholder="e.g. Priya Shah"
                      className="w-full bg-secondary border border-border text-text-primary p-3 font-sans text-sm outline-none focus:border-accent-dark transition-colors"
                    />
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
              </div>
            )}

          </div>

        </main>
      </div>
    </>
  );
}

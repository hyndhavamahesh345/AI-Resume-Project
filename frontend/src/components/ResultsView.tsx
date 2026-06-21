import React from 'react';

interface ResultsViewProps {
  onStartOver: () => void;
  data?: any;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return { text: 'text-green-600', bg: 'bg-green-600' };
  if (score >= 80) return { text: 'text-yellow-500', bg: 'bg-yellow-500' };
  if (score > 40) return { text: 'text-orange-500', bg: 'bg-orange-500' };
  return { text: 'text-red-500', bg: 'bg-red-500' };
};

export default function ResultsView({ onStartOver, data }: ResultsViewProps) {
  // State for tracking checked edits checklist items
  const [checkedEdits, setCheckedEdits] = React.useState<Record<number, boolean>>({});

  // Graceful fallback values for layout testing if data is still loading or undefined
  const candidate = data?.candidate || "Candidate";
  const atsScore = data?.ats_score || 0;
  const jobMatchScore = data?.job_match_score || 0;
  const missingSkills = data?.missing_skills || [];
  const recommendations = data?.recommendations || [];
  const optimizationScore = data?.optimization_score || 0;
  const resumeEdits = data?.resume_edits || [];

  const toggleEdit = (idx: number) => {
    setCheckedEdits(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // SVG circular dial properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * atsScore) / 100;

  let dialColor = '#ef4444';
  let scoreStatus = 'Needs Work';
  if (atsScore >= 90) {
    dialColor = '#16a34a';
    scoreStatus = 'Excellent';
  } else if (atsScore >= 80) {
    dialColor = '#eab308';
    scoreStatus = 'Good';
  } else if (atsScore > 40) {
    dialColor = '#f97316';
    scoreStatus = 'Needs Polish';
  }

  const renderProgressBar = (label: string, value: number) => {
    let barColor = 'bg-red-500';
    if (value >= 90) barColor = 'bg-green-600';
    else if (value >= 80) barColor = 'bg-yellow-500';
    else if (value > 40) barColor = 'bg-orange-500';

    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
          <span className="font-sans text-[12px] font-bold text-text-primary">{value}/100</span>
        </div>
        <div className="w-full bg-secondary h-2.5 border border-border/30 overflow-hidden">
          <div className={`h-full ${barColor} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl animate-fade-in pb-20 flex flex-col md:flex-row gap-8 items-start">
      
      {/* Mock Left Sidebar (Resume Worded style) */}
      <div className="w-full md:w-64 shrink-0 border border-border p-6 bg-secondary/10 flex flex-col self-stretch md:self-start">
        <p className="font-sans text-[9px] font-bold tracking-[0.25em] text-text-muted uppercase mb-6">
          Navigation
        </p>
        <nav className="flex flex-col gap-1.5 mb-8">
          <button className="flex items-center justify-between py-2.5 px-4 bg-secondary text-left font-sans text-xs font-semibold text-text-primary border border-border tracking-wide transition-all">
            <span>Dashboard</span>
            <span className="bg-accent-dark text-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider">Active</span>
          </button>
          <button className="flex items-center justify-between py-2.5 px-4 text-left font-sans text-xs font-medium text-text-muted hover:text-text-primary tracking-wide transition-all hover:bg-secondary/20">
            <span>Targeted Match</span>
            <span className="text-[10px] text-text-secondary">✓</span>
          </button>
          <button className="flex items-center justify-between py-2.5 px-4 text-left font-sans text-xs font-medium text-text-muted hover:text-text-primary tracking-wide transition-all hover:bg-secondary/20">
            <span>STAR Resume Audit</span>
            <span className="text-[10px] text-text-secondary">✓</span>
          </button>
          <button className="flex items-center justify-between py-2.5 px-4 text-left font-sans text-xs font-medium text-text-muted/40 cursor-not-allowed tracking-wide transition-all">
            <span>LinkedIn Optimization</span>
            <span className="text-[8px] text-text-muted/40 font-bold uppercase tracking-widest">Locked</span>
          </button>
          <button className="flex items-center justify-between py-2.5 px-4 text-left font-sans text-xs font-medium text-text-muted hover:text-text-primary tracking-wide transition-all hover:bg-secondary/20">
            <span>Career Planner</span>
            <span className="text-[10px] text-text-secondary">✓</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-border/50">
          <button 
            onClick={onStartOver}
            className="w-full bg-accent-dark text-primary py-3 px-4 font-sans text-[10px] font-bold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity text-center cursor-pointer"
          >
            Re-upload Resume
          </button>
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="flex-1 min-w-0">
        
        {/* Header */}
        <div className="mb-8">
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-2">
            Intelligence Report Generated
          </p>
          <h2 className="font-serif text-[42px] font-light text-text-primary mb-1 leading-none">
            {candidate}'s Career Dashboard
          </h2>
          <p className="font-sans text-[13px] font-light text-text-muted">
            Targeted resume analysis and real-time score optimization feedback.
          </p>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Metrics Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Overall Score Dial */}
            <div className="border border-border p-6 bg-secondary/10 flex flex-col items-center justify-center text-center">
              <p className="font-sans text-[10px] font-bold tracking-[0.15em] text-text-muted uppercase mb-6">
                Overall ATS Score
              </p>
              
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                {/* Background Ring & Animated Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="stroke-border/20 fill-none"
                    strokeWidth="10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="fill-none transition-all duration-1000 ease-out"
                    stroke={dialColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="square"
                  />
                </svg>
                {/* Center score labels */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-serif text-[52px] font-light leading-none text-text-primary">
                    {atsScore}
                  </span>
                  <span className="font-sans text-[10px] text-text-muted uppercase tracking-[0.1em] mt-1">/ 100</span>
                </div>
              </div>

              <span className="font-sans text-[12px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">
                Status: <span style={{ color: dialColor }}>{scoreStatus}</span>
              </span>
            </div>

            {/* Score Metrics Breakdown */}
            <div className="border border-border p-6 bg-secondary/10">
              <p className="font-sans text-[10px] font-bold tracking-[0.15em] text-text-muted uppercase mb-5">
                Score Metrics
              </p>
              {renderProgressBar("Job Match Score", jobMatchScore)}
              {renderProgressBar("STAR Optimization Score", optimizationScore)}
            </div>

          </div>

          {/* Right Detailed Feedback Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Skill Gap Analysis */}
            <div className="border border-border p-8 bg-secondary/10">
              <h3 className="font-serif text-[24px] font-light text-text-primary mb-1">Keyword & Skill Gap</h3>
              <p className="font-sans text-[12px] text-text-muted mb-6">Keywords and technical skills you need to add to pass ATS screening:</p>
              
              {missingSkills.length === 0 ? (
                <div className="bg-accent-dark text-primary inline-block py-2 px-4 font-sans text-[11px] font-medium">
                  Perfect Match! No missing skills detected.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {missingSkills.map((skill: string) => (
                    <span key={skill} className="bg-red-900/40 border border-red-500/20 text-red-100 py-1.5 px-3.5 font-sans text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* How to Extend Your Score (STAR format checklist) */}
            <div className="border border-border p-8 bg-secondary/10">
              <div className="flex justify-between items-baseline mb-6">
                <h3 className="font-serif text-[24px] font-light text-text-primary">How to Extend Your Score</h3>
                <span className="font-sans text-[10px] font-semibold text-text-muted uppercase tracking-[0.1em]">
                  STAR Format Checklist
                </span>
              </div>
              <p className="font-sans text-[12px] text-text-muted mb-6 leading-relaxed">
                Your resume has been audited against the STAR (Situation, Task, Action, Result) framework. Complete the checklist items below to increase your resume’s impact:
              </p>

              <div className="flex flex-col gap-3.5">
                {resumeEdits.length === 0 ? (
                  <div className="bg-accent-dark text-primary inline-block py-3 px-5 font-sans text-[11px] font-medium">
                    Excellent! Your resume fully aligns with the STAR format.
                  </div>
                ) : (
                  resumeEdits.map((edit: string, idx: number) => {
                    const isChecked = !!checkedEdits[idx];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => toggleEdit(idx)}
                        className={`flex gap-4 items-start border p-4 cursor-pointer transition-all ${
                          isChecked 
                            ? 'border-border/30 bg-secondary/10 opacity-50' 
                            : 'border-border bg-primary hover:border-accent-dark'
                        }`}
                      >
                        <div className={`w-5 h-5 border shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                          isChecked 
                            ? 'border-text-muted bg-text-muted text-primary' 
                            : 'border-border bg-secondary'
                        }`}>
                          {isChecked && <span className="text-[10px] leading-none">✓</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`font-sans text-[13px] leading-[1.6] transition-all ${
                            isChecked ? 'line-through text-text-muted' : 'text-text-secondary'
                          }`}>
                            {edit}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI Career Roadmap */}
            <div className="border border-border p-8 bg-secondary/10">
              <h3 className="font-serif text-[24px] font-light text-text-primary mb-6">AI Career Roadmap</h3>
              <p className="font-sans text-[12px] text-text-muted mb-6">
                Step-by-step career path recommendations from your copilot to bridge technical gaps and land interviews:
              </p>

              <div className="flex flex-col gap-4">
                {recommendations.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start border border-border p-4 bg-primary">
                    <span className="font-serif text-[20px] font-bold text-accent-dark leading-none">
                      {idx + 1}
                    </span>
                    <p className="font-sans text-[13px] leading-[1.6] text-text-secondary">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

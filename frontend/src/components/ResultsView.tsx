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
  // Graceful fallback values for layout testing if data is still loading or undefined
  const candidate = data?.candidate || "Candidate";
  const atsScore = data?.ats_score || 0;
  const jobMatchScore = data?.job_match_score || 0;
  const semanticMatch = data?.semantic_match || 0;
  const recruiterScore = data?.recruiter_score || 0;
  const interviewProbability = data?.interview_probability || "0%";
  const missingSkills = data?.missing_skills || [];
  const strengths = data?.strengths || [];
  const recommendations = data?.recommendations || [];

  return (
    <div className="w-full max-w-3xl animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-2">
            Intelligence Report Generated
          </p>
          <h2 className="font-serif text-[42px] font-light text-text-primary mb-1 leading-none">
            {candidate}'s Career Report
          </h2>
          <p className="font-sans text-[13px] font-light text-text-primary">
            Powered by AI ATS Resume
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onStartOver}
            className="bg-transparent border border-border text-text-primary py-2 px-5 font-sans text-[11px] font-medium hover:bg-border transition-colors"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Primary Scores Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "ATS Score", value: atsScore },
          { label: "Job Match", value: jobMatchScore },
          { label: "Semantic Match", value: semanticMatch }
        ].map((stat, idx) => {
          const colors = getScoreColor(stat.value);
          return (
            <div key={idx} className="border border-border p-6 bg-secondary/10 flex flex-col items-center justify-center text-center">
              <p className="font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase mb-3">
                {stat.label}
              </p>
              <div className="flex items-end gap-1">
                <span className={`font-serif text-[48px] font-light leading-none ${colors.text}`}>
                  {stat.value}
                </span>
                <span className="font-sans text-[14px] text-text-muted mb-1">/100</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recruiter & Interview Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-border p-8 bg-secondary/10">
          <h3 className="font-serif text-[24px] font-light text-text-primary mb-4">Recruiter View</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className={`font-serif text-[36px] font-light leading-none ${getScoreColor(recruiterScore).text}`}>
              {recruiterScore}
            </span>
            <span className="font-sans text-[12px] text-text-muted mb-1">Score</span>
          </div>
          <p className="font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase mb-3">Insights</p>
          <ul className="flex flex-col gap-2">
            {strengths.map((str: string, i: number) => (
              <li key={i} className="font-sans text-[12px] text-text-primary flex items-start gap-2">
                <span className="text-accent-dark font-bold mt-[2px]">•</span> {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border p-8 bg-secondary/10 flex flex-col justify-center items-center text-center">
          <h3 className="font-serif text-[24px] font-light text-text-primary mb-2">Interview Probability</h3>
          <span className="font-serif text-[64px] font-light text-accent-dark mb-4">
            {interviewProbability}
          </span>
          <p className="font-sans text-[12px] text-text-muted px-4">
            Based on historical data for candidates with similar skill gaps and recruiter scores.
          </p>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="border border-border p-8 mb-6 bg-secondary/10">
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-1">Skill Gap Analysis</h3>
        <p className="font-sans text-[13px] text-text-primary mb-6">Missing skills required by the Job Description</p>
        
        {missingSkills.length === 0 ? (
          <div className="bg-text-primary text-primary inline-block py-2 px-4 font-sans text-[11px] font-medium">
            Perfect Match! No missing skills detected.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {missingSkills.map((skill: string) => (
              <span key={skill} className="bg-red-900/40 border border-red-500/30 text-red-200 py-2 px-4 font-sans text-[12px] font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Career Roadmap */}
      <div className="border border-border p-8 mb-6 bg-secondary/10 relative">
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-6">Career Roadmap</h3>
        <p className="font-sans text-[12px] text-text-primary mb-6">
          Actionable steps generated by AI to bridge your skill gap and increase your interview probability.
        </p>

        <div className="flex flex-col gap-4">
          {recommendations.map((step: string, idx: number) => (
            <div key={idx} className="flex gap-4 items-start border border-border p-4 bg-primary">
              <span className="font-serif text-[24px] font-light text-accent-dark leading-none">
                {idx + 1}
              </span>
              <p className="font-sans text-[13px] leading-[1.6] text-text-secondary mt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

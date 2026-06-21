'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data representing processed candidates
const MOCK_CANDIDATES = [
  {
    id: '1',
    candidate: 'Sarah Jenkins',
    role: 'Senior React Engineer',
    ats_score: 92,
    job_match_score: 95,
    semantic_match: 94,
    recruiter_score: 96,
    interview_probability: '98%',
    missing_skills: [],
    strengths: ['Expert Next.js architecture', 'GraphQL integration', 'Mentorship experience']
  },
  {
    id: '2',
    candidate: 'David Chen',
    role: 'Senior React Engineer',
    ats_score: 85,
    job_match_score: 88,
    semantic_match: 86,
    recruiter_score: 82,
    interview_probability: '75%',
    missing_skills: ['GraphQL'],
    strengths: ['Strong React foundation', 'Redux state management', 'Agile workflow']
  },
  {
    id: '3',
    candidate: 'Michael Ross',
    role: 'Senior React Engineer',
    ats_score: 65,
    job_match_score: 55,
    semantic_match: 60,
    recruiter_score: 45,
    interview_probability: '15%',
    missing_skills: ['Next.js', 'GraphQL', 'System Design'],
    strengths: ['JavaScript basics', 'HTML/CSS']
  }
];

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [isUploading, setIsUploading] = useState(false);

  // Mock batch upload handler
  const handleBatchUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setCandidates([
        {
          id: '4',
          candidate: 'Elena Rodriguez',
          role: 'Senior React Engineer',
          ats_score: 98,
          job_match_score: 97,
          semantic_match: 99,
          recruiter_score: 98,
          interview_probability: '99%',
          missing_skills: [],
          strengths: ['Ex-FAANG Tech Lead', 'Micro-frontends', 'Performance Optimization']
        },
        ...MOCK_CANDIDATES
      ]);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-600/10 border-green-600/20';
    if (score >= 80) return 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20';
    if (score > 40) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-border bg-primary/80 backdrop-blur-md z-50 flex items-center justify-between px-8 lg:px-16">
        <Link href="/" className="font-serif text-xl tracking-wide text-text-primary">
          AI ATS RESUME
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
            Candidate View →
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-8 lg:px-16 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-3">
              Recruiter Intelligence
            </p>
            <h1 className="font-serif text-[48px] font-light text-text-primary leading-none mb-2">
              Candidate Leaderboard
            </h1>
            <p className="font-sans text-[14px] text-text-muted">
              Role: Senior React Engineer · 3 Candidates Processed
            </p>
          </div>
          
          <button 
            onClick={handleBatchUpload}
            disabled={isUploading}
            className="bg-text-primary text-primary py-3 px-6 font-sans text-[11px] font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUploading ? 'ANALYZING BATCH...' : 'UPLOAD BATCH (ZIP)'}
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="border border-border bg-secondary/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Candidate</th>
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Recruiter Score</th>
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">ATS Score</th>
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Interview Prob.</th>
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Missing Skills</th>
                <th className="py-4 px-6 font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Top Strength</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand, idx) => (
                <tr key={cand.id} className="border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-[18px] text-text-muted italic">#{idx + 1}</span>
                      <span className="font-sans text-[14px] font-medium text-text-primary">{cand.candidate}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center justify-center w-10 h-10 border font-serif text-[18px] ${getScoreColor(cand.recruiter_score)}`}>
                      {cand.recruiter_score}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-sans text-[14px] text-text-primary">{cand.ats_score}/100</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-serif text-[24px] text-text-primary">{cand.interview_probability}</span>
                  </td>
                  <td className="py-5 px-6">
                    {cand.missing_skills.length === 0 ? (
                      <span className="font-sans text-[11px] text-green-600 bg-green-600/10 px-2 py-1">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {cand.missing_skills.map((skill, i) => (
                          <span key={i} className="font-sans text-[10px] text-red-500 bg-red-500/10 px-2 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-sans text-[12px] text-text-muted">
                      {cand.strengths[0] || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

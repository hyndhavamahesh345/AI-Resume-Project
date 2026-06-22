"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import ResultsView from '../../components/ResultsView';

export default function LinkedInOptimization() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);

  const startProcessing = async () => {
    if (!linkedinUrl) return;
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('linkedinUrl', linkedinUrl);
    if (jobDescription) formData.append('jobDescription', jobDescription);
    try {
      const res = await fetch('/api/linkedin-optimize', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data = await res.json();
      setResultsData(data);
    } catch (e) {
      console.error(e);
      setResultsData({ error: true });
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = linkedinUrl.trim().startsWith('http');

  return (
    <>
      {/* Navigation */}
      <nav className="border-b border-border h-14 px-8 flex items-center justify-between shrink-0">
        <Link href="/" className="font-serif text-lg tracking-[0.1em] text-text-primary hover:opacity-80 transition-opacity">
          AI ATS RESUME
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
            About →
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center p-12">
        <h2 className="font-serif text-3xl mb-8 animate-fade-up">LinkedIn Profile Optimization</h2>
        <div className="w-full max-w-md space-y-6">
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-text-secondary mb-1">
              LinkedIn URL (required)
            </label>
            <input
              id="linkedinUrl"
              type="url"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-secondary border border-border text-text-primary p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-text-secondary mb-1">
              Job Description (optional)
            </label>
            <textarea
              id="jobDescription"
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the target job description..."
              className="w-full bg-secondary border border-border text-text-primary p-2 rounded"
            />
          </div>
          <button
            onClick={startProcessing}
            disabled={!isFormValid || isProcessing}
            className={`w-full py-2 px-4 font-sans text-sm font-medium tracking-wide uppercase transition-colors ${
              isFormValid ? 'bg-accent-dark text-primary hover:opacity-90' : 'bg-border text-text-muted cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Optimizing…' : 'Optimize LinkedIn'}
          </button>
        </div>

        {resultsData && (
          <section className="mt-12 w-full max-w-4xl animate-fade-in">
            <ResultsView onStartOver={() => { setResultsData(null); setLinkedinUrl(''); setJobDescription(''); }} data={resultsData} />
          </section>
        )}
      </main>
    </>
  );
}

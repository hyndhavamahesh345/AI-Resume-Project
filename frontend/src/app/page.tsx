import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-primary text-text-primary font-sans min-h-screen">
      {/* Navigation */}
      <nav className="bg-primary border-b border-border px-12 h-14 flex items-center justify-between sticky top-0 z-[100]">
        <Link href="/">
          <span className="font-serif text-lg font-normal tracking-[0.1em] text-text-primary uppercase cursor-pointer">
            AI ATS RESUME
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/recruiter" className="font-sans text-[10px] text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors">
            Recruiter Login
          </Link>
          <Link 
            href="/app" 
            className="bg-accent-dark text-primary py-2 px-5 font-sans text-[10px] font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity"
          >
            Try it →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen bg-primary grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
        <div className="flex flex-col justify-center py-24 px-12 lg:pl-16">
          <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-10">
            Application intelligence pipeline
          </p>
          <h1 className="font-serif text-[clamp(48px,5vw,80px)] font-light text-text-primary leading-none m-0">
            Match the role.
          </h1>
          <h1 className="font-serif text-[clamp(48px,5vw,80px)] font-light italic text-text-muted leading-none mb-8">
            Prove the capability.
          </h1>
          <p className="font-sans text-sm font-light leading-[1.8] text-text-muted max-w-[440px] mb-10">
            Upload a resume and job description. Get an ATS-optimized resume and recruiter-ready outreach copy — in under 2 minutes.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link 
              href="/app" 
              className="bg-accent-dark text-primary py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity text-center"
            >
              Try AI ATS Resume
            </Link>
            <a 
              href="#how-it-works" 
              className="bg-transparent text-text-muted border border-border py-3.5 px-8 font-sans text-[11px] font-medium tracking-[0.12em] uppercase hover:border-text-muted hover:text-text-primary transition-colors text-center"
            >
              See how it works
            </a>
          </div>
        </div>
        
        {/* Decorative Right Side */}
        <div className="bg-secondary border-l border-border hidden lg:flex items-center justify-center relative overflow-hidden">
          <div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 w-[320px] h-[480px] border border-border rounded-t-[160px] opacity-80 border-b-0 pointer-events-none"></div>
          <div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 w-[200px] h-[340px] border border-border rounded-t-[100px] opacity-50 border-b-0 pointer-events-none"></div>
          <span className="font-serif text-[200px] font-light text-border leading-none relative z-10 select-none">
            R
          </span>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="the-problem" className="bg-secondary py-24 px-8 lg:px-16 border-t border-border">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-6">
            The Problem
          </p>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light text-text-primary m-0">
            Three failure modes.
          </h2>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light italic text-text-muted mb-16">
            One broken outcome.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary border-t-2 border-text-primary pt-6 px-6 pb-8">
              <div className="font-serif text-[40px] font-light text-accent-dark leading-none mb-4">01</div>
              <h3 className="font-sans text-sm font-medium text-text-primary mb-2.5 mt-0">ATS Rejection</h3>
              <p className="font-sans text-[13px] font-light leading-[1.7] text-text-muted m-0">
                Keyword mismatch filters qualified candidates before any human ever reads their resume.
              </p>
            </div>
            <div className="bg-primary border-t-2 border-text-primary pt-6 px-6 pb-8">
              <div className="font-serif text-[40px] font-light text-accent-dark leading-none mb-4">02</div>
              <h3 className="font-sans text-sm font-medium text-text-primary mb-2.5 mt-0">Credential Bias</h3>
              <p className="font-sans text-[13px] font-light leading-[1.7] text-text-muted m-0">
                Recruiters pattern-match on brand names. Technical ability is invisible until the interview — too late.
              </p>
            </div>
            <div className="bg-primary border-t-2 border-text-primary pt-6 px-6 pb-8">
              <div className="font-serif text-[40px] font-light text-accent-dark leading-none mb-4">03</div>
              <h3 className="font-sans text-sm font-medium text-text-primary mb-2.5 mt-0">Time Cost</h3>
              <p className="font-sans text-[13px] font-light leading-[1.7] text-text-muted m-0">
                20–40 hours of manual tailoring per application cycle. High effort, low leverage, wrong format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-primary py-24 px-8 lg:px-16 border-t border-border">
        <div className="max-w-[800px] mx-auto">
          <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-6">
            How It Works
          </p>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light text-text-primary m-0">
            Two inputs.
          </h2>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light italic text-text-muted mb-16">
            Three AI stages.
          </h2>

          <div className="flex flex-col">
            {[
              { num: "01", title: "Job Match Intelligence", desc: "AI understands the role requirements and evaluates your profile using semantic matching and recruiter-grade scoring.", isMuted: false },
              { num: "02", title: "Candidate Intelligence Report", desc: "Receive ATS score, skill-gap analysis, recruiter insights, strengths, weaknesses, and interview probability.", isMuted: false },
              { num: "03", title: "AI Career Copilot", desc: "Optimize your resume, generate tailored applications, and get personalized recommendations to land more interviews.", isMuted: true },
            ].map((step, idx) => (
              <div key={idx} className="grid grid-cols-[80px_1px_1fr] gap-x-6 pb-9 last:pb-0">
                <div>
                  <span className={`font-serif text-[32px] font-light leading-none ${step.isMuted ? 'text-text-muted' : 'text-text-primary'}`}>
                    {step.num}
                  </span>
                </div>
                <div className="bg-border w-[1px]"></div>
                <div className="pt-1">
                  <h3 className="font-sans text-sm font-medium text-text-primary m-0 mb-2">{step.title}</h3>
                  <p className="font-sans text-[13px] font-light leading-[1.7] text-text-muted m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-secondary py-24 px-8 lg:px-16 border-t border-border">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <div className="font-serif text-[clamp(64px,10vw,96px)] font-light text-text-primary leading-none">
              25% → 88%
            </div>
            <p className="font-sans text-[13px] font-light text-text-muted mt-4">
              +63 percentage points. ATS keyword alignment improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-6">
                Before AI ATS Resume
              </p>
              {[
                "Keyword mismatch causes ATS rejection before any human reads the resume",
                "Generic resume language fails to match JD-specific terminology",
                "No proof of capability beyond a list of claimed skills"
              ].map((text, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <span className="text-border shrink-0 mt-[2px] font-sans">—</span>
                  <p className="font-sans text-[13px] font-light leading-[1.7] text-text-muted m-0">{text}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-sans text-[9px] font-medium tracking-[0.25em] text-text-muted uppercase mb-6">
                After AI ATS Resume
              </p>
              {[
                "Resume rebuilt in JD's exact language — passes ATS keyword matching",
                "Skills list automatically generated from matching tech stacks",
                "Recruiter message under 300 characters for immediate impact"
              ].map((text, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <span className="text-text-secondary shrink-0 mt-[2px] font-sans">✓</span>
                  <p className="font-sans text-[13px] font-normal leading-[1.7] text-text-primary m-0">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-28 px-8 lg:px-16 border-t border-border relative overflow-hidden">
        <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-[280px] h-[400px] border border-border rounded-t-[140px] border-b-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-[700px] mx-auto text-center md:text-left">
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light text-text-primary m-0">
            The application is no longer a claim.
          </h2>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light italic text-text-muted m-0 mb-12">
            It is a demonstration.
          </h2>
          <Link 
            href="/app" 
            className="bg-accent-dark text-primary text-[12px] py-4 px-10 font-sans font-medium tracking-[0.12em] uppercase hover:opacity-90 transition-opacity inline-block"
          >
            Try AI ATS Resume →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-8 px-8 lg:px-16 flex justify-between items-center flex-wrap gap-4">
        <span className="font-serif text-lg font-normal tracking-[0.1em] text-text-primary uppercase">
          AI ATS RESUME
        </span>
        <span className="font-sans text-[11px] font-light text-text-muted">
          AI ATS Resume
        </span>
      </footer>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [step, setStep] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);   // "AI ATS" fades up
    const t2 = setTimeout(() => setStep(2), 750);   // "RESUME" fades up
    const t3 = setTimeout(() => setStep(3), 1450);  // separator line expands
    const t4 = setTimeout(() => setStep(4), 2100);  // subtitle fades in
    const t5 = setTimeout(() => setHiding(true), 3300); // overlay fades out
    const t6 = setTimeout(() => onComplete(), 3800);    // done — reveal page
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#F1EDE6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hiding ? 0 : 1,
        transition: 'opacity 500ms ease',
        pointerEvents: hiding ? 'none' : 'all',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Logo — "AI ATS" then "RESUME" staggered */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
          <span
            className={step >= 1 ? 'animate-fade-up' : ''}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(56px, 7vw, 88px)',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: '#0D0603',
              opacity: step >= 1 ? undefined : 0,
              display: 'block',
            }}
          >
            AI ATS
          </span>
          <span
            className={step >= 2 ? 'animate-fade-up' : ''}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(56px, 7vw, 88px)',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: '#3D2018',
              opacity: step >= 2 ? undefined : 0,
              display: 'block',
            }}
          >
            RESUME
          </span>
        </div>

        {/* Expanding separator line */}
        <div
          className={step >= 3 ? 'animate-expand-line' : ''}
          style={{
            marginTop: '20px',
            height: '1px',
            backgroundColor: '#CBAD8D',
            width: step >= 3 ? undefined : 0,
            opacity: step >= 3 ? undefined : 0,
          }}
        />

        {/* Subtitle */}
        <p
          className={step >= 4 ? 'animate-fade-in' : ''}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '0.22em',
            color: '#6B4A38',
            textTransform: 'uppercase',
            marginTop: '14px',
            opacity: step >= 4 ? undefined : 0,
          }}
        >
          Match the role. Prove the capability.
        </p>
      </div>
    </div>
  );
}

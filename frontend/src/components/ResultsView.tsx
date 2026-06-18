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
  const beforeScore = data?.keywordAlignment?.beforeScore || 50;
  const afterScore = data?.keywordAlignment?.afterScore || 83;
  const improvement = afterScore - beforeScore;
  const beforeColors = getScoreColor(beforeScore);
  const afterColors = getScoreColor(afterScore);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const summary = data?.atsOptimizedResume?.summary || "Ambitious B2B SaaS developer...";
    const skills = (data?.atsOptimizedResume?.skills || ['React', 'TypeScript']).join(', ');
    const content = `SUMMARY\n${summary}\n\nSKILLS\n${skills}\n\nEXPERIENCE\n[Full rewritten experience bullets here]`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ATS_Optimized_Resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const coverLetterText = data?.coverLetter || `Dear Hiring Team at [Target Company]...`;
  const recruiterMessageText = data?.recruiterMessage || `Hello Hiring Team...`;
  const allText = `COVER LETTER:\n${coverLetterText}\n\nRECRUITER MESSAGE:\n${recruiterMessageText}`;

  return (
    <div className="w-full max-w-3xl animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-2">
            Pipeline Complete
          </p>
          <h2 className="font-serif text-[42px] font-light text-text-primary mb-1 leading-none">
            Your application package
          </h2>
          <p className="font-sans text-[13px] font-light text-text-primary">
            B2B SaaS · Role
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleCopy(allText, 'all')}
            className="bg-transparent border border-border text-text-primary py-2 px-5 font-sans text-[11px] font-medium hover:bg-border transition-colors"
          >
            {copiedId === 'all' ? 'Copied!' : 'Copy all'}
          </button>
          <button 
            onClick={onStartOver}
            className="bg-transparent border border-border text-text-primary py-2 px-5 font-sans text-[11px] font-medium hover:bg-border transition-colors"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Card 1: Keyword alignment */}
      <div className="border border-border p-8 mb-6 bg-secondary/10">
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-6">Keyword alignment</h3>
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase mb-4">Before Rewrite</p>
            <div className="flex items-end gap-3 mb-2">
              <span className={`font-serif text-[42px] font-light leading-none ${beforeColors.text}`}>{beforeScore}%</span>
              <div className="flex-1 h-[2px] bg-border relative bottom-3">
                <div className={`absolute left-0 top-0 h-full ${beforeColors.bg}`} style={{ width: `${beforeScore}%` }}></div>
              </div>
            </div>
            <p className="font-sans text-[11px] text-text-muted">{data?.keywordAlignment?.keywordsBefore || 3} of {data?.keywordAlignment?.totalKeywords || 6} keywords</p>
          </div>
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase mb-4">After Rewrite</p>
            <div className="flex items-end gap-3 mb-2">
              <span className={`font-serif text-[42px] font-light leading-none ${afterColors.text}`}>{afterScore}%</span>
              <div className="flex-1 h-[2px] bg-border relative bottom-3">
                <div className={`absolute left-0 top-0 h-full ${afterColors.bg}`} style={{ width: `${afterScore}%` }}></div>
              </div>
            </div>
            <p className="font-sans text-[11px] text-text-muted">{data?.keywordAlignment?.keywordsAfter || 5} of {data?.keywordAlignment?.totalKeywords || 6} keywords</p>
          </div>
        </div>

        <div className="bg-text-primary text-primary inline-block py-2 px-4 font-sans text-[11px] font-medium mb-6">
          +{improvement}% improvement after ATS optimization
        </div>

        <div className="flex flex-wrap gap-2">
          {(data?.keywordAlignment?.skillsList || ['React', 'TypeScript', 'GraphQL', 'CI/CD pipelines', 'GitHub Actions']).map((skill: string) => (
            <span key={skill} className="bg-border/60 text-text-primary py-1.5 px-3 font-sans text-[11px] font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card 2: Resume transformation */}
      <div className="border border-border p-8 mb-6 bg-secondary/10">
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-1">Resume transformation</h3>
        <p className="font-sans text-[13px] text-text-primary mb-8">How your bullets were rewritten to match JD language</p>

        <div className="flex flex-col gap-4">
          {(data?.resumeTransformation || [
            {
              before: "Built a task management app using React hooks (useState, useEffect, useContext) with REST API integration and JWT user authentication",
              after: "Built scalable task management app with React hooks and REST API integration for dynamic data handling."
            },
            {
              before: "Developed an e-commerce storefront with shopping cart, Stripe payment integration, and a Node.js/Express backend",
              after: "Developed e-commerce storefront featuring a shopping cart, with Node.js/Express backend and Stripe payment."
            },
            {
              before: "Styled responsive UIs matching Figma mockups pixel-perfectly using CSS Flexbox and Grid",
              after: "Styled responsive UIs perfectly matching Figma mockups using advanced CSS Flexbox and Grid methodologies."
            }
          ]).map((pair: any, idx: number) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <div className="border border-border p-5 bg-primary">
                <p className="font-sans text-[9px] font-medium tracking-[0.2em] text-text-muted uppercase mb-3">Before</p>
                <p className="font-sans text-[12px] leading-[1.6] text-text-muted font-light">{pair.before}</p>
              </div>
              <div className="border border-accent-dark p-5 bg-secondary">
                <p className="font-sans text-[9px] font-medium tracking-[0.2em] text-text-muted uppercase mb-3">After</p>
                <p className="font-sans text-[12px] leading-[1.6] text-text-primary font-normal">{pair.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: ATS-optimized resume */}
      <div className="border border-border p-8 mb-6 relative bg-secondary/10">
        <button 
          onClick={handleDownload}
          className="absolute top-8 right-8 bg-text-primary text-primary py-2 px-5 font-sans text-[11px] font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          ↓ Download
        </button>
        
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-2 pr-32">ATS-optimized resume</h3>
        <p className="font-sans text-[12px] text-text-primary mb-8 max-w-[85%] leading-[1.6]">
          Keywords integrated include {(data?.keywordAlignment?.skillsList || ['React', 'TypeScript', 'CI/CD pipelines', 'GitHub Actions', 'Jest', 'GraphQL']).join(", ")}. Focus on designing scalable, reusable UI components and frontend architecture decisions.
        </p>

        <div className="border border-border p-6 bg-secondary/50">
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-3">Summary</p>
          <p className="font-sans text-[13px] leading-[1.8] text-text-primary mb-6">
            {data?.atsOptimizedResume?.summary || "Ambitious B2B SaaS developer skilled in JavaScript and React, with a strong focus on implementing scalable, reusable UI components. Proficient in creating and maintaining CI/CD pipelines using GitHub Actions. Experienced in frontend architecture decisions and performance optimization for tailor-fit user experiences. Committed to integrating GraphQL APIs for efficient data management."}
          </p>

          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-3">Skills</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(data?.atsOptimizedResume?.skills || ['React', 'TypeScript', 'GitHub Actions', 'CI/CD pipelines', 'Jest', 'GraphQL', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS', 'Git']).map((skill: string) => (
              <span key={skill} className="bg-border/60 text-text-primary py-1 px-2.5 font-sans text-[11px]">
                {skill}
              </span>
            ))}
          </div>

          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mb-1">
            Experience (1 Roles · 6 Rewritten bullets)
          </p>
          <p className="font-sans text-[12px] text-text-primary">
            Full content in downloaded PDF
          </p>
        </div>
      </div>

      {/* Card 4: Live project */}
      <div className="border border-border p-8 mb-6 bg-secondary/10">
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-6">Live project</h3>
        <p className="font-sans text-[13px] text-text-primary mb-2">
          Deployment did not complete.
        </p>
        <p className="font-sans text-[11px] text-text-primary">
          Opens in new tab · Live on Vercel · Shareable as proof of work.
        </p>
      </div>

      {/* Card 5: Cover letter */}
      <div className="border border-border p-8 mb-6 relative bg-secondary/10">
        <button 
          onClick={() => handleCopy(coverLetterText, 'cover')}
          className="absolute top-8 right-8 bg-transparent border border-border text-text-primary py-1.5 px-4 font-sans text-[11px] font-medium hover:bg-border transition-colors"
        >
          {copiedId === 'cover' ? 'Copied!' : 'Copy'}
        </button>
        
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-6">Cover letter</h3>
        
        <div className="border border-border p-6 bg-secondary/50 max-h-[300px] overflow-y-auto">
          <pre className="font-sans text-[13px] leading-[1.8] text-text-secondary whitespace-pre-wrap font-light font-sans">
{data?.coverLetter || `Dear Hiring Team at [Target Company],

With a solid background in B2B SaaS development, I am excited about the opportunity to contribute to your team as a strategic leader in designing scalable, reusable UI components. I am particularly skilled in using React to build efficient user interfaces and have hands-on experience in architecting performant frontend solutions, making architecture decisions, and optimizing data management through GraphQL API integration. My proficiency with CI/CD pipelines and GitHub Actions further enhances my capability to streamline development cycles—a vital component for maintaining agile deployment environments.

A concrete example of my capabilities can be seen in a task management application accessible at [live project URL]. This application demonstrates my adeptness with both React and CI/CD pipelines by utilizing React hooks to create scalable components and employing GitHub Actions to automate deployments. The project's dynamic data handling through REST API also showcases my preparedness for integrating GraphQL APIs, aligning precisely with the core responsibilities outlined for the role at [Target Company].

I am genuinely thrilled about the possibility of contributing to the cutting-edge B2B SaaS solutions at [Target Company]. The prospect of owning frontend architecture decisions and mentor juninor engineers within your innovative environment is inspiring. I would love the opportunity to discuss how my skills and experiences can benefit [Target Company] and help catalyze the development of pioneering SaaS products.

Best regards,
Jordan Rivera`}
          </pre>
        </div>
      </div>

      {/* Card 6: Recruiter message */}
      <div className="border border-border p-8 mb-6 relative bg-secondary/10">
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <span className="font-sans text-[10px] font-medium text-text-primary">252/300 chars</span>
          <button 
            onClick={() => handleCopy(recruiterMessageText, 'recruiter')}
            className="bg-transparent border border-border text-text-primary py-1.5 px-4 font-sans text-[11px] font-medium hover:bg-border transition-colors"
          >
            {copiedId === 'recruiter' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <h3 className="font-serif text-[28px] font-light text-text-primary mb-6">Recruiter message</h3>
        
        <div className="border border-border p-6 bg-secondary/50">
          <pre className="font-sans text-[13px] leading-[1.8] text-text-secondary whitespace-pre-wrap font-light font-sans">
{data?.recruiterMessage || `Hello Hiring Team,

I'm reaching out regarding the B2B SaaS role. My background aligns with the role's focus on React, and I created a live project to demonstrate relevant capability.

Project: available upon request

I'd welcome the chance to connect.`}
          </pre>
        </div>
      </div>

    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

import OpenAI from 'openai';

// Ensure this runs in a Node environment so pdf-parse works properly.
if (typeof global !== 'undefined') {
  (global as any).DOMMatrix = (global as any).DOMMatrix || function() {};
  (global as any).ImageData = (global as any).ImageData || function() {};
  (global as any).Path2D = (global as any).Path2D || function() {};
}
export const maxDuration = 60; // Allow up to 60 seconds for processing

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;
    const applicantName = formData.get('applicantName') as string || 'Applicant';
    const company = formData.get('company') as string || 'Target Company';
    const recruiter = formData.get('recruiter') as string || 'Hiring Manager';
    const linkedinUrl = formData.get('linkedinUrl') as string | null;

    // Allow either (resume + jobDescription) OR linkedinUrl (optional jobDescription)
    if (!linkedinUrl && (!resumeFile || !jobDescription)) {
      return NextResponse.json({ error: 'Provide either a resume + job description or a LinkedIn URL' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return NextResponse.json({ error: 'Groq API Key is missing or not configured in .env.local' }, { status: 500 });
    }

    // Extract text from PDF
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let resumeText = '';
    
    try {
      const pdfParseModule = require('pdf-parse');
      const parsePDF = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule);
      const pdfData = await parsePDF(buffer);
      resumeText = pdfData.text;
    } catch (e) {
      console.error("PDF parse error:", e);
      // Fallback: If parsing fails (e.g. not a valid PDF like our Demo blob), we just read the raw text.
      resumeText = buffer.toString('utf-8');
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    // Prepare prompt for Qwen
    const prompt = `
You are an expert ATS (Applicant Tracking System) optimizer and technical recruiter.
I will provide you with a Job Description and a Candidate's Resume.

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Candidate Name: ${applicantName}
Target Company: ${company}
Recruiter Name: ${recruiter}

Please analyze the resume against the job description.
You MUST return a strictly valid JSON object. Do NOT wrap it in markdown formatting (like \`\`\`json). Return exactly the following JSON structure and nothing else:
{
  "keywordAlignment": {
    "beforeScore": 50,
    "afterScore": 85,
    "totalKeywords": 6,
    "keywordsBefore": 3,
    "keywordsAfter": 5,
    "skillsList": ["React", "TypeScript", "GraphQL", "CI/CD pipelines", "GitHub Actions"]
  },
  "resumeTransformation": [
    {
      "before": "Built a task management app using React hooks (useState, useEffect, useContext) with REST API integration and JWT user authentication",
      "after": "Built scalable task management app with React hooks and REST API integration for dynamic data handling."
    }
  ],
  "atsOptimizedResume": {
    "summary": "Ambitious developer skilled in...",
    "skills": ["React", "TypeScript"]
  },
  "coverLetter": "Dear Hiring Team...",
  "recruiterMessage": "Hello Hiring Team..."
}

CRITICAL: Return EXACTLY 3 objects inside the "resumeTransformation" array by finding 3 weak bullets in the original resume and rewriting them to include JD keywords.
    `;

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant', // Using most stable Llama 3.1 8B via Groq API
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    
    // Safely extract JSON if the model decides to wrap it in markdown
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

    return NextResponse.json(parsedData);

  } catch(error: any) {
    console.error('================ FATAL ANALYSIS ERROR ================');
    console.error(error);
    if (error.response) {
      console.error(error.response.data);
    }
    console.error('=====================================================');
    return NextResponse.json({ error: error.message || 'An error occurred during analysis' }, { status: 500 });
  }
}

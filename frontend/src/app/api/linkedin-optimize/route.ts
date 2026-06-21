import { NextRequest, NextResponse } from 'next/server';

// Ensure Node globals for pdf-parse (not used here but kept for consistency)
if (typeof global !== 'undefined') {
  (global as any).DOMMatrix = (global as any).DOMMatrix || function() {};
  (global as any).ImageData = (global as any).ImageData || function() {};
  (global as any).Path2D = (global as any).Path2D || function() {};
}

export const maxDuration = 60; // allow up to 60 seconds

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const linkedinUrl = formData.get('linkedinUrl') as string | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!linkedinUrl) {
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return NextResponse.json({ error: 'Groq API Key is missing or not configured in .env.local' }, { status: 500 });
    }

    // Forward request to the FastAPI backend orchestrator (same endpoint as full analysis)
    const backendForm = new FormData();
    backendForm.append('linkedinUrl', linkedinUrl);
    if (jobDescription) backendForm.append('jobDescription', jobDescription);

    const res = await fetch('http://localhost:8000/api/v1/analyze', {
      method: 'POST',
      body: backendForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Backend API failed: ${errText}` }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('LinkedIn optimization error:', error);
    return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: 500 });
  }
}

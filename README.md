# AI ATS Resume

An intelligent, AI-powered application pipeline that helps you seamlessly tailor your resume to any job description. Built with Next.js, Tailwind CSS, and the Groq LLM API.

## 🚀 Features
- **JD Analysis:** Automatically extracts required skills and keywords from a pasted Job Description.
- **ATS-Optimized Resume:** Reconstructs and realigns your resume experience to match the exact language and keywords needed to pass Applicant Tracking Systems.
- **Outreach Copy Generation:** Instantly writes a tailored cover letter and a concise recruiter outreach message based on your profile and the target role.
- **Beautiful UI:** Premium, elegant, and fully responsive user interface with live progress indicators.

## 🛠️ Tech Stack
- **Frontend Framework:** [Next.js](https://nextjs.org/) (React, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend API:** Next.js Route Handlers
- **AI Integration:** [Groq API](https://groq.com/) (running `llama-3.1-8b-instant` for lightning-fast inference)
- **PDF Parsing:** `pdf-parse`

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hyndhavamahesh345/AI-Resume-Project.git
   cd AI-Resume-Project/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `frontend` directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the local development port (typically `http://localhost:3000` or `http://localhost:3001`).

## 🤝 Usage
1. Upload your current Resume (PDF or DOCX) or use one of the interactive Demos.
2. Paste the target Job Description.
3. Fill in your details (Name, Target Company, Recruiter).
4. Click **Analyze my application** and let the AI build your personalized application package in seconds!

import HeroCard from "@/components/HeroCard";
import Navbar from "@/components/Navbar";
import { Github } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/your-username/your-repo';
  const LIVE_URL = process.env.NEXT_PUBLIC_LIVE_URL || 'https://your-live-domain.com';
  const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || `${GITHUB_URL}#api-documentation`;
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Navbar/>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">Mini Procure-to-Pay system</h2>
          <p className="text-lg text-gray-600 mb-6">
            Build & evaluate a simplified Procure-to-Pay workflow: create purchase requests, multi-level approvals, automatic PO generation, receipt validation and admin/finance UI — backed by a Django REST API and a modern Next.js frontend.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <a href={GITHUB_URL} className="inline-flex items-center gap-2 px-4 py-2 rounded border hover:bg-gray-50" target="_blank" rel="noreferrer">
              <Github className="w-4 h-4" /> View Code
            </a>

            <a href={LIVE_URL} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary-600 text-white" target="_blank" rel="noreferrer">
              Live Demo
            </a>

            <a href={DOCS_URL} className="inline-flex items-center gap-2 px-4 py-2 rounded border hover:bg-gray-50" target="_blank" rel="noreferrer">
              API Docs
            </a>
          </div>

          <ul className="grid gap-3 text-sm text-gray-700">
            <li><strong>Backend:</strong> Django, Django REST Framework, SimpleJWT, PostgreSQL</li>
            <li><strong>Frontend:</strong> Next.js (App Router), React, Tailwind CSS, React Hook Form, Recharts</li>
            <li><strong>Infra:</strong> Docker, docker-compose, optional Celery for background tasks</li>
            <li><strong>AI tools:</strong> OCR (pytesseract/pdfplumber), optional OpenAI for extraction/validation</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Quick highlights</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Role-based access (staff, approver-level-1/2, finance)</li>
              <li>Multi-level approval workflow (PENDING → APPROVED/REJECTED)</li>
              <li>Immutable final states, concurrency-safe using DB transactions</li>
              <li>File uploads: proforma, receipt, generated purchase order</li>
              <li>Automated PO generation & optional OCR + AI extraction</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Deliverables</h3>
            <ol className="list-decimal pl-6 text-sm text-gray-700 space-y-2">
              <li>GitHub repo with source code & Docker config</li>
              <li>Deployed public instance (URL provided in README)</li>
              <li>API docs (Swagger / Postman collection)</li>
              <li>Short README with run & deploy instructions</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-semibold mb-6">Features & Pages</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <HeroCard title="Authentication" 
          href="/login" 
          description="JWT login, role-aware UI and protected routes." />
          <HeroCard title="Requests"
        //  href="/requests"
        href="/"
        //  this is returning 404 for some reason href="/requests"
          description="Create, update (pending), list and detail views with item lines." />
          <HeroCard title="Approvals" description="Multi-level approvals with approve/reject endpoints and audit trail." />
          <HeroCard title="Finance" description="Finance role UI, upload files, download POs and receipts." />
          <HeroCard title="Document Processing" description="Proforma OCR, PO auto-generation, receipt validation." />
          <HeroCard title="DevOps" description="Dockerfile + docker-compose, example deployment scripts." />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-semibold mb-4">Quick Start (Docker)</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm">
{`git clone <repo>
cd project
# copy .env (set DB, SECRET_KEY, etc)
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:3000`}
        </pre>
        <p className="mt-3 text-sm text-gray-600">See README in the repository for environment variables, deployment steps, and API documentation link.</p>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} P2P System — Built for Technical Assessment</div>
          <div className="flex items-center gap-4">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            <a href={LIVE_URL} target="_blank" rel="noreferrer" className="hover:underline">Live demo</a>
            <a href={DOCS_URL} target="_blank" rel="noreferrer" className="hover:underline">API docs</a>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}

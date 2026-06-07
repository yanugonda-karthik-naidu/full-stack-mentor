import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume Mentor — Learn2Compile" },
      { name: "description", content: "Build an ATS-friendly fresher resume." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <PageShell
      title="Resume Mentor"
      description="A clean, ATS-friendly template plus what to put in each section."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Fresher Resume — One Page Template</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm">
            <li><b>Header</b>: Name, phone, email, LinkedIn, GitHub, location. No photo.</li>
            <li><b>Summary (3 lines)</b>: who you are, your stack, what you want.</li>
            <li><b>Skills</b>: Java, OOP, Collections, SQL, Spring Boot, JPA, HTML/CSS/JS, Git.</li>
            <li><b>Projects (2-3)</b>: title, stack, 3 bullet points (problem, what you built, impact/scale).</li>
            <li><b>Education</b>: degree, college, year. Mention coursework if non-CS.</li>
            <li><b>Certifications & courses</b>: only relevant ones.</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">ATS tips</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>Use a single-column layout.</li>
            <li>Save and submit as PDF.</li>
            <li>Mirror keywords from the job description.</li>
            <li>Quantify (users, %, time saved).</li>
            <li>No images, no tables, no fancy fonts.</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sample project bullet
        </h3>
        <p className="mt-3 text-sm">
          Built a <b>Student Management System</b> (Spring Boot + MySQL + JPA) with full CRUD REST API and a vanilla JS frontend; designed normalized schema for 5 entities; integrated and tested 12 endpoints via Postman; deployed backend on Render.
        </p>
      </div>
      <div className="mt-6">
        <Link to="/chat" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Ask the mentor to review your resume
        </Link>
      </div>
    </PageShell>
  );
}
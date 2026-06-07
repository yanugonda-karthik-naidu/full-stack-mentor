import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";
import { getProject } from "@/lib/datasets/projects";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const p = getProject(projectId);
  if (!p) {
    return (
      <PageShell title="Project not found">
        <Link to="/projects" className="text-primary">← Back to projects</Link>
      </PageShell>
    );
  }
  return (
    <PageShell title={p.title} description={`${p.level} · ${p.stack.join(" · ")}`}>
      <Link to="/projects" className="text-sm text-primary hover:underline">← All projects</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Overview"><p className="text-sm">{p.overview}</p></Card>
          <Card title="Requirements">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
          </Card>
          <Card title="Step-by-step Build Guide">
            <ol className="list-decimal space-y-2 pl-5 text-sm">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </Card>
          <Card title="REST API Design">
            <ul className="list-disc space-y-1 pl-5 text-sm font-mono">{p.apis.map((a) => <li key={a}>{a}</li>)}</ul>
          </Card>
          <Card title="Common Errors">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.commonErrors.map((e) => <li key={e}>{e}</li>)}</ul>
          </Card>
          <Card title="Interview Questions">
            <ul className="space-y-2 text-sm">{p.interviewQuestions.map((q) => (
              <li key={q} className="rounded-md border border-border/60 bg-secondary/50 p-3">{q}</li>
            ))}</ul>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Folder Structure">
            <pre className="overflow-auto rounded-md bg-secondary p-3 text-xs">{p.folderStructure}</pre>
          </Card>
          <Card title="Database">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.database.map((d) => <li key={d}>{d}</li>)}</ul>
          </Card>
          <Card title="Frontend">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.frontend.map((d) => <li key={d}>{d}</li>)}</ul>
          </Card>
          <Card title="Backend">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.backend.map((d) => <li key={d}>{d}</li>)}</ul>
          </Card>
          <Card title="Deployment">
            <ul className="list-disc space-y-1 pl-5 text-sm">{p.deployment.map((d) => <li key={d}>{d}</li>)}</ul>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
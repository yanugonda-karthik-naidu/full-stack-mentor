import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PROJECTS } from "@/lib/datasets/projects";
import { loadProgress, saveProgress } from "@/lib/storage";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Learn2Compile" },
      { name: "description", content: "Step-by-step real projects from beginner to advanced." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => setCompleted(loadProgress().completedProjects), []);

  const toggle = (id: string, v: boolean) => {
    const p = loadProgress();
    p.completedProjects = v
      ? Array.from(new Set([...p.completedProjects, id]))
      : p.completedProjects.filter((x) => x !== id);
    saveProgress(p);
    setCompleted(p.completedProjects);
  };

  return (
    <PageShell
      title="Project Mentor"
      description="Build real, resume-ready projects. Each one comes with a step-by-step guide, common errors, and interview questions."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((p) => {
          const done = completed.includes(p.id);
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-xl border bg-card p-5 transition-colors ${
                done ? "border-accent/40" : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <Badge variant={p.level === "Beginner" ? "secondary" : p.level === "Intermediate" ? "default" : "destructive"}>
                  {p.level}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.overview}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={done} onCheckedChange={(v) => toggle(p.id, !!v)} />
                  Mark as completed
                </label>
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Open guide →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
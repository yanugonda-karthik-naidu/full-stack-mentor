import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Progress } from "@/components/ui/progress";
import { MODULES, ROADMAP_DAYS, moduleDays } from "@/lib/datasets/roadmap";
import { PROJECTS } from "@/lib/datasets/projects";
import { loadProgress } from "@/lib/storage";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [doneProjects, setDoneProjects] = useState<string[]>([]);
  useEffect(() => {
    const p = loadProgress();
    setCompleted(p.completedTopics);
    setDoneProjects(p.completedProjects);
  }, []);

  const totals = MODULES.map((m) => {
    const days = moduleDays(m);
    const done = days.filter((d) => completed[String(d.day)]).length;
    return { name: m, done, total: days.length, pct: Math.round((done / days.length) * 100) };
  });
  const overall = Math.round(
    (Object.values(completed).filter(Boolean).length / ROADMAP_DAYS.length) * 100,
  );
  const projectPct = Math.round((doneProjects.length / PROJECTS.length) * 100);

  return (
    <PageShell title="Progress Tracking" description="Where you stand across every module.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Overall roadmap" value={`${overall}%`} pct={overall} />
        <Card title="Projects" value={`${doneProjects.length} / ${PROJECTS.length}`} pct={projectPct} />
      </div>
      <div className="mt-8 space-y-3">
        <h2 className="font-display text-lg font-semibold">By module</h2>
        {totals.map((t) => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="text-muted-foreground">{t.done} / {t.total} · {t.pct}%</span>
            </div>
            <Progress value={t.pct} className="mt-2 h-2" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Card({ title, value, pct }: { title: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <span className="font-display text-2xl font-semibold">{value}</span>
      </div>
      <Progress value={pct} className="mt-3 h-2" />
    </div>
  );
}
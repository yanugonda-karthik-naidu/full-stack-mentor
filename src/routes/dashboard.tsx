import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Flame, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Progress } from "@/components/ui/progress";
import { ROADMAP_DAYS, getDay, MODULES, moduleDays } from "@/lib/datasets/roadmap";
import { PROJECTS } from "@/lib/datasets/projects";
import {
  currentDayNumber,
  loadProgress,
  loadTasks,
  todayKey,
} from "@/lib/storage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Learn2Compile AI Mentor" },
      { name: "description", content: "Your daily mission, streak and learning journey." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [day, setDay] = useState(1);
  const [progress, setProgress] = useState(() => loadProgress());
  const [tasksToday, setTasksToday] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDay(currentDayNumber());
    setProgress(loadProgress());
    setTasksToday(loadTasks()[todayKey()] ?? {});
  }, []);

  const today = getDay(day);
  const next = getDay(Math.min(ROADMAP_DAYS.length, day + 1));
  const completedTopics = Object.values(progress.completedTopics).filter(Boolean).length;
  const overallPct = Math.round((completedTopics / ROADMAP_DAYS.length) * 100);
  const todayDone = Object.values(tasksToday).filter(Boolean).length;
  const topicDifficulty =
    day <= 30 ? "Beginner" : day <= 70 ? "Intermediate" : "Advanced";

  // Per-module progress
  const moduleProgress = MODULES.map((name) => {
    const days = moduleDays(name);
    const done = days.filter((d) => progress.completedTopics[String(d.day)]).length;
    return { name, pct: Math.round((done / days.length) * 100), done, total: days.length };
  });

  const readinessStage =
    overallPct < 15
      ? "Beginner Stage"
      : overallPct < 40
      ? "Foundation Builder"
      : overallPct < 70
      ? "Project Ready"
      : overallPct < 90
      ? "Interview Ready"
      : "Job Ready";

  const jobReadiness = Math.min(
    100,
    Math.round(
      overallPct * 0.6 +
        (progress.completedProjects.length / Math.max(1, PROJECTS.length)) * 30 +
        Math.min(progress.streak, 30) * 0.33,
    ),
  );

  return (
    <PageShell title="" description="">
      {/* Welcome / hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border p-6 sm:p-8"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="relative z-10 text-primary-foreground">
          <p className="text-sm/relaxed opacity-90">
            {greeting()} 👋
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
            Day {day} of 120 — {today.module}
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">
            Today's mission:{" "}
            <span className="font-semibold">{today.topic}</span>. Estimated study time:{" "}
            {today.duration}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/today"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:-translate-y-0.5 transition-transform"
            >
              Start today's mission <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4" /> Ask your mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${progress.streak} days 🔥`}
          hint={progress.streak > 0 ? "Keep showing up." : "Finish today to start."}
        />
        <StatCard
          icon={Target}
          label="Topics completed"
          value={`${completedTopics}/${ROADMAP_DAYS.length}`}
          hint={`${overallPct}% of roadmap`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Today's checklist"
          value={`${todayDone}/4`}
          hint={todayDone === 4 ? "Done — great work!" : "Finish to extend streak"}
        />
        <StatCard
          icon={Trophy}
          label="Next milestone"
          value={next.topic}
          hint={`Day ${next.day}`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Today's mission */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Today's mission
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold">
                {today.topic}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{today.module}</p>
            </div>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
              {topicDifficulty}
            </span>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {today.subtopics.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Today's progress</span>
              <span>{todayDone}/4</span>
            </div>
            <Progress value={(todayDone / 4) * 100} className="h-2" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/today"
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Open today <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-accent/10"
            >
              Practice this topic
            </Link>
          </div>
        </div>

        {/* Job readiness */}
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Job readiness
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold">{jobReadiness}%</span>
            <span className="text-sm text-muted-foreground">{readinessStage}</span>
          </div>
          <Progress value={jobReadiness} className="mt-3 h-2" />
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Topics</span>
              <span>{overallPct}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Projects</span>
              <span>
                {progress.completedProjects.length}/{PROJECTS.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Streak</span>
              <span>{progress.streak} days</span>
            </li>
          </ul>
          <Link
            to="/assessment"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Take this week's assessment <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Learning journey */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Learning journey
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Your roadmap progress
            </h2>
          </div>
          <Link to="/roadmap" className="text-sm text-primary hover:underline">
            Full roadmap →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {moduleProgress.map((m) => (
            <div key={m.name} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground">
                  {m.done}/{m.total}
                </span>
              </div>
              <Progress value={m.pct} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div className="mt-3 truncate font-display text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
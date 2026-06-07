import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Target, Trophy, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Progress } from "@/components/ui/progress";
import { ROADMAP_DAYS, getDay } from "@/lib/datasets/roadmap";
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
      { name: "description", content: "Your learning progress, streak and current day." },
    ],
  }),
  component: Dashboard,
});

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
  const total = ROADMAP_DAYS.length;
  const completedTopics = Object.values(progress.completedTopics).filter(Boolean).length;
  const totalTopics = ROADMAP_DAYS.length;
  const overallPct = Math.round((completedTopics / totalTopics) * 100);
  const jobReadiness = Math.min(
    100,
    Math.round(
      overallPct * 0.6 +
        (progress.completedProjects.length / PROJECTS.length) * 30 +
        Math.min(progress.streak, 30) * 0.33,
    ),
  );
  const todayDone = Object.values(tasksToday).filter(Boolean).length;
  const todayTotal = 4;

  const stats = [
    {
      label: "Current Day",
      value: `${day} / ${total}`,
      icon: BookOpen,
      hint: today.module,
    },
    {
      label: "Topics Completed",
      value: `${completedTopics}`,
      icon: Target,
      hint: `of ${totalTopics}`,
    },
    {
      label: "Learning Streak",
      value: `${progress.streak} days`,
      icon: Flame,
      hint: progress.streak > 0 ? "Keep it going!" : "Start today",
    },
    {
      label: "Job Readiness",
      value: `${jobReadiness}%`,
      icon: Trophy,
      hint: jobReadiness > 60 ? "On track" : "Building foundation",
    },
  ];

  return (
    <PageShell
      title={`Welcome back — Day ${day}`}
      description={`Module: ${today.module} · Today's topic: ${today.topic}`}
      action={
        <Link
          to="/today"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-mentor)] hover:-translate-y-0.5 transition-transform"
        >
          Open Today's Plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 font-display text-2xl font-semibold">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Overall progress</h2>
            <span className="text-sm text-muted-foreground">{overallPct}%</span>
          </div>
          <Progress value={overallPct} className="mt-3 h-2" />

          <div className="mt-6 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              Today's checklist
            </h3>
            <div className="text-sm text-foreground">
              {todayDone}/{todayTotal} tasks done today
            </div>
            <Progress
              value={(todayDone / todayTotal) * 100}
              className="h-2"
            />
            <Link
              to="/today"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Go to today's tasks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Today's focus</h2>
          <p className="mt-2 text-sm text-muted-foreground">{today.module}</p>
          <p className="mt-1 font-display text-base text-foreground">
            {today.topic}
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {today.subtopics.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {s}
              </li>
            ))}
          </ul>
          <Link
            to="/roadmap/$day"
            params={{ day: String(day) }}
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Open day {day} → roadmap
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
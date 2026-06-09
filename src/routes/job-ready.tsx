import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Compass, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Progress } from "@/components/ui/progress";
import { MODULES, ROADMAP_DAYS, moduleDays } from "@/lib/datasets/roadmap";
import { loadProgress, type ProgressState } from "@/lib/storage";

export const Route = createFileRoute("/job-ready")({
  head: () => ({
    meta: [
      { title: "Am I Job Ready? — Learn2Compile" },
      {
        name: "description",
        content:
          "Skill-gap analysis across Java, SQL, Frontend, Backend, Projects and Interview prep with personalized next steps.",
      },
    ],
  }),
  component: JobReadyPage,
});

const PILLARS: Array<{ name: string; modules: string[]; weight: number }> = [
  { name: "Java Core", modules: ["Java Foundations", "Object-Oriented Programming", "Exceptions, Collections & Generics"], weight: 25 },
  { name: "SQL", modules: ["SQL & MySQL"], weight: 15 },
  { name: "Frontend", modules: ["HTML, CSS & JavaScript"], weight: 15 },
  { name: "Backend", modules: ["Spring Boot & REST APIs", "JPA, Hibernate & MySQL Integration"], weight: 20 },
  { name: "Projects", modules: [], weight: 15 },
  { name: "Interview Prep", modules: ["Interview & Placement Prep"], weight: 10 },
];

function JobReadyPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const pillarScores = PILLARS.map((p) => {
    if (p.name === "Projects") {
      const total = 8;
      const done = progress?.completedProjects.length ?? 0;
      const pct = Math.min(100, Math.round((done / total) * 100));
      return { ...p, pct, done, total, label: `${done}/${total} projects shipped` };
    }
    const relevantDays = MODULES.filter((m) => p.modules.includes(m)).flatMap((m) =>
      moduleDays(m),
    );
    const total = relevantDays.length;
    const done = relevantDays.filter((d) => progress?.completedTopics[String(d.day)]).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { ...p, pct, done, total, label: `${done}/${total} days completed` };
  });

  const overall = Math.round(
    pillarScores.reduce((acc, p) => acc + (p.pct * p.weight) / 100, 0),
  );

  const stage =
    overall < 20
      ? "Just Starting"
      : overall < 40
        ? "Foundation Builder"
        : overall < 60
          ? "Coding Confident"
          : overall < 80
            ? "Project Ready"
            : "Job Ready";

  const gaps = pillarScores
    .filter((p) => p.pct < 60)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  const strengths = pillarScores.filter((p) => p.pct >= 60).map((p) => p.name);

  return (
    <PageShell
      title="Am I Job Ready?"
      description="A real, honest snapshot of where you stand and what to fix next."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-6 lg:col-span-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Target className="h-3.5 w-3.5" /> Job Readiness
          </div>
          <p className="mt-3 font-display text-5xl font-bold text-primary">{overall}%</p>
          <p className="mt-1 text-sm font-semibold">{stage}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Day {progress?.completedDays.length ?? 0} of {ROADMAP_DAYS.length} ·{" "}
            {progress?.streak ?? 0}🔥 streak
          </p>
          <Link
            to="/chat"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" /> Ask mentor: what's my next step?
          </Link>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Skill Pillars
          </h2>
          {pillarScores.map((p) => (
            <div key={p.name} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.label} · weight {p.weight}%
                </p>
              </div>
              <Progress value={p.pct} className="mt-2" />
              <p className="mt-1 text-right text-xs font-semibold text-primary">{p.pct}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-base font-semibold">Your Strengths</h3>
          </div>
          {strengths.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No strong area yet — that's normal early on. Focus on one pillar at a time.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {strengths.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-600" />
            <h3 className="font-display text-base font-semibold">Top Gaps to Close</h3>
          </div>
          {gaps.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              You're solid across the board. Time to apply — polish resume & start mock interviews.
            </p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {gaps.map((g) => (
                <li key={g.name} className="flex items-start gap-2">
                  <Circle className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
                  <span>
                    <strong>{g.name}</strong> — {g.pct}%. {recommendationFor(g.name)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-semibold">Recommended Next 7 Days</h3>
        <ol className="mt-3 space-y-2 text-sm">
          {buildSevenDayPlan(pillarScores).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </PageShell>
  );
}

function recommendationFor(pillar: string): string {
  switch (pillar) {
    case "Java Core":
      return "Lock OOP + Collections; solve 5 problems daily on HackerRank Java.";
    case "SQL":
      return "Practice JOINS + GROUP BY on HackerRank SQL Basic + LeetCode #176.";
    case "Frontend":
      return "Build a portfolio + a ToDo app with HTML/CSS/vanilla JS.";
    case "Backend":
      return "Build one Spring Boot CRUD with JPA + MySQL end-to-end.";
    case "Projects":
      return "Ship one resume-worthy project this month with GitHub README.";
    case "Interview Prep":
      return "Daily: 5 OOP questions + explain your project out loud.";
    default:
      return "Open the mentor and ask for a focused plan.";
  }
}

function buildSevenDayPlan(scores: Array<{ name: string; pct: number }>): string[] {
  const weakest = [...scores].sort((a, b) => a.pct - b.pct)[0]?.name ?? "Java Core";
  return [
    `Day 1–2: Strengthen ${weakest} — 1 hour theory + 5 practice problems daily.`,
    "Day 3: Revise OOP — write a small program using all 4 pillars (encapsulation, inheritance, polymorphism, abstraction).",
    "Day 4: SQL drill — 10 JOIN + GROUP BY queries on HackerRank.",
    "Day 5: Ship a feature — add one new endpoint or page to an existing project.",
    "Day 6: Mock interview — answer 10 questions out loud on your current topic.",
    "Day 7: Reflect — update resume bullets, push code to GitHub, plan next week.",
  ];
}
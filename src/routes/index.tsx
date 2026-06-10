import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  MessageSquare,
  Sparkle,
  Sparkles,
  Target,
} from "lucide-react";

import { MentorLogo } from "@/components/MentorLogo";
import {
  currentDayNumber,
  loadProgress,
  newThreadId,
  upsertThread,
} from "@/lib/storage";
import { getDay } from "@/lib/datasets/roadmap";
import { nextInChain } from "@/lib/datasets/prerequisites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learn2Compile AI Mentor — Your personal Java Full Stack coach" },
      {
        name: "description",
        content:
          "A premium AI mentor that turns absolute beginners into job-ready Java Full Stack developers in 120 days. Personal plans, projects, interview prep.",
      },
      { property: "og:title", content: "Learn2Compile AI Mentor" },
      {
        property: "og:description",
        content:
          "Your personal AI career mentor for Java Full Stack jobs.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const day = currentDayNumber();
  const today = getDay(day);
  const progress = loadProgress();
  const completed = Object.values(progress.completedTopics).filter(Boolean).length;
  const pct = Math.round((completed / 120) * 100);
  const next = nextInChain(today.topic) ?? "Continue current module";

  const askWith = (prompt: string) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("l2c.seedPrompt", prompt);
    }
    const id = newThreadId();
    upsertThread({ id, title: prompt.slice(0, 48) || "New chat", updatedAt: Date.now(), messages: [] });
    window.dispatchEvent(new Event("l2c:threads-changed"));
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  };

  const examples = [
    `Explain ${today.topic}`,
    "Create today's plan",
    "Test my knowledge",
    "Generate practice questions",
    "Start mock interview",
    "Review my progress",
  ];

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[560px] opacity-60"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 sm:pt-16">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground w-fit">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Premium AI career mentor · 120-day Java Full Stack track
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* LEFT — Where you are */}
          <section className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur sm:p-8">
            <p className="text-sm text-muted-foreground">Welcome back 👋</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Day{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                {day}
              </span>{" "}
              of 120
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Today's Mission
                </p>
                <p className="mt-1 font-display text-lg font-semibold">{today.topic}</p>
                <p className="mt-1 text-xs text-muted-foreground">{today.module}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Estimated Study Time
                </p>
                <p className="mt-1 font-display text-lg font-semibold">{today.duration}</p>
                <p className="mt-1 text-xs text-muted-foreground">Focus block</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Current Streak
                </p>
                <p className="mt-1 flex items-center gap-1 font-display text-lg font-semibold">
                  <Flame className="h-4 w-4 text-accent" />
                  {progress.streak} Days
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pct}% topics complete
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Next Milestone
                </p>
                <p className="mt-1 flex items-center gap-1 font-display text-lg font-semibold">
                  <Target className="h-4 w-4 text-accent" />
                  {next}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">After today's topic</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/today"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-mentor)] transition-transform hover:-translate-y-0.5"
              >
                Open Today's Mission <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent/10"
              >
                Dashboard
              </Link>
            </div>
          </section>

          {/* RIGHT — Premium floating mentor card */}
          <section className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-card to-background p-6 shadow-[var(--shadow-mentor)] sm:p-8">
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-20"
              style={{ background: "var(--gradient-hero)" }}
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <MentorLogo size={26} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">
                    Learn2Compile AI Mentor
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Ask anything · personalized to Day {day}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => askWith(ex)}
                    className="group flex items-start gap-2 rounded-xl border border-border bg-background/70 p-3 text-left text-sm text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
                  >
                    <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <span className="truncate">{ex}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => askWith("")}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-mentor)] transition-transform hover:-translate-y-0.5"
              >
                <MessageSquare className="h-4 w-4" />
                Start Learning With Mentor
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/mentor"
                className="mt-3 block text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Open full Mentor Hub →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

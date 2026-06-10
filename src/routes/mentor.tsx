import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Briefcase,
  Calendar,
  ClipboardCheck,
  Code2,
  Gauge,
  GraduationCap,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import { MentorLogo } from "@/components/MentorLogo";
import { currentDayNumber, loadProgress, newThreadId, upsertThread } from "@/lib/storage";
import { getDay } from "@/lib/datasets/roadmap";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor Hub · Learn2Compile" },
      {
        name: "description",
        content:
          "Your personal AI mentor command center — ask anything, plan today, generate practice, run mock interviews, and review progress.",
      },
    ],
  }),
  component: MentorHub,
});

type Action = {
  emoji: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  prompt: string;
};

function MentorHub() {
  const navigate = useNavigate();
  const day = currentDayNumber();
  const today = getDay(day);
  const progress = loadProgress();

  const actions: Action[] = [
    {
      emoji: "📅",
      icon: Calendar,
      title: "Create Today's Plan",
      desc: "A focused 2-hour study plan for today.",
      prompt: `Create a focused 2-hour study plan for today. I'm on Day ${day}: ${today.topic}.`,
    },
    {
      emoji: "📘",
      icon: Brain,
      title: "Explain Today's Topic",
      desc: `Beginner-friendly walkthrough of ${today.topic}.`,
      prompt: `Explain ${today.topic} from scratch with a real-life example and a small Java code snippet.`,
    },
    {
      emoji: "💻",
      icon: Code2,
      title: "Generate Practice",
      desc: "Easy + medium problems for the current topic.",
      prompt: `Give me 5 practice programs (3 easy, 2 medium) on ${today.topic} with hints, plus HackerRank and LeetCode links.`,
    },
    {
      emoji: "🧩",
      icon: ClipboardCheck,
      title: "Quiz Me",
      desc: "A 5-question quiz with answers and explanations.",
      prompt: `Quiz me on ${today.topic} — 5 MCQs with the correct answer and a 1-line explanation after each.`,
    },
    {
      emoji: "🎯",
      icon: GraduationCap,
      title: "Start Mock Interview",
      desc: "Fresher-level interview round with feedback.",
      prompt: `Conduct a 5-question fresher-level technical interview on ${today.module}. Ask one question at a time, wait for my answer, then give feedback and the ideal answer.`,
    },
    {
      emoji: "🚀",
      icon: Briefcase,
      title: "Suggest a Project",
      desc: "A small project that matches my current level.",
      prompt: `Suggest a beginner-friendly Java project that uses ${today.module}. Include features, folder structure, and step-by-step build plan.`,
    },
    {
      emoji: "📈",
      icon: Gauge,
      title: "Check Job Readiness",
      desc: "Skill gaps and what to do next.",
      prompt: `Based on my progress (${Object.values(progress.completedTopics).filter(Boolean).length} topics done, streak ${progress.streak} days), tell me my job readiness, my top 3 skill gaps, and the next 7 days of actions.`,
    },
    {
      emoji: "💡",
      icon: Lightbulb,
      title: "Motivate Me",
      desc: "A reality-based boost tied to my progress.",
      prompt: `Give me a short, realistic motivation message based on my actual progress and remind me of the next milestone.`,
    },
  ];

  const askWith = (prompt: string) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("l2c.seedPrompt", prompt);
    }
    const id = newThreadId();
    upsertThread({ id, title: prompt.slice(0, 48), updatedAt: Date.now(), messages: [] });
    window.dispatchEvent(new Event("l2c:threads-changed"));
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-mentor)]">
          <MentorLogo size={26} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold tracking-tight">
            AI Mentor Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Day {day} · {today.module} · {today.topic}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.title}
            type="button"
            onClick={() => askWith(a.prompt)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-mentor)]"
          >
            <div className="flex items-center gap-2 text-2xl">
              <span>{a.emoji}</span>
              <a.icon className="h-4 w-4 text-accent opacity-70" />
            </div>
            <h3 className="mt-3 font-display text-base font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Ask mentor →
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Need something specific? Open a fresh chat and ask the mentor anything.
        </p>
        <button
          type="button"
          onClick={() => askWith("")}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Open Mentor Chat
        </button>
      </div>
    </div>
  );
}
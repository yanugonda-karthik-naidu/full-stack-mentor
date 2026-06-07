import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  GraduationCap,
  Map,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learn2Compile AI Mentor — Beginner to Java Full Stack Job" },
      {
        name: "description",
        content:
          "Your personal 120-day AI mentor for the Java Full Stack journey. Daily tasks, roadmap, projects and interview prep — built for absolute beginners.",
      },
      { property: "og:title", content: "Learn2Compile AI Mentor" },
      {
        property: "og:description",
        content:
          "Beginner-to-job Java Full Stack mentor. Daily plan, projects, interview prep.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[480px] opacity-60"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:pt-24">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground w-fit">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          120-day beginner-to-job mentor
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Your personal{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            AI mentor
          </span>{" "}
          to a Java Full Stack job.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Built for ECE, Mechanical, Civil, non-IT and complete beginners.
          Every day you log in, you know exactly what to learn, what to build,
          and how to prepare — no more confusion.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-mentor)] transition-transform hover:-translate-y-0.5"
          >
            <MessageSquare className="h-4 w-4" />
            Ask the mentor
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/10"
          >
            Open dashboard
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, title: "Today's Plan", desc: "Exact tasks, study time, practice." },
            { icon: Map, title: "120-Day Roadmap", desc: "Java → SQL → Spring Boot → Full Stack." },
            { icon: Briefcase, title: "Project Mentor", desc: "Step-by-step real projects." },
            { icon: GraduationCap, title: "Interview Trainer", desc: "Mock Qs across every track." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-display text-sm font-semibold">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

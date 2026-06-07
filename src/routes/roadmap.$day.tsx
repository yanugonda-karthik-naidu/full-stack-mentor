import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Video } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { ROADMAP_DAYS, getDay } from "@/lib/datasets/roadmap";

export const Route = createFileRoute("/roadmap/$day")({
  component: RoadmapDayPage,
});

function RoadmapDayPage() {
  const { day } = Route.useParams();
  const navigate = useNavigate();
  const n = Math.min(ROADMAP_DAYS.length, Math.max(1, Number(day) || 1));
  const d = getDay(n);

  return (
    <PageShell
      title={`Day ${d.day} · ${d.topic}`}
      description={`${d.module} · ${d.duration}`}
      action={
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate({ to: "/roadmap/$day", params: { day: String(Math.max(1, n - 1)) } })
            }
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-accent/5 disabled:opacity-50"
            disabled={n <= 1}
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </button>
          <button
            onClick={() =>
              navigate({
                to: "/roadmap/$day",
                params: { day: String(Math.min(ROADMAP_DAYS.length, n + 1)) },
              })
            }
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
            disabled={n >= ROADMAP_DAYS.length}
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="Subtopics">
            <ul className="space-y-1 text-sm">
              {d.subtopics.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Practice">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {d.practice.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Section>
          <Section title="Assignment">
            <p className="text-sm">{d.assignment}</p>
          </Section>
          <Section title="Interview Questions">
            <ul className="space-y-2 text-sm">
              {d.interviewQuestions.map((q) => (
                <li key={q} className="rounded-md border border-border/60 bg-secondary/50 p-3">
                  {q}
                </li>
              ))}
            </ul>
          </Section>
        </div>
        <div className="space-y-4">
          <Section title="Expected Outcome">
            <p className="text-sm">{d.outcome}</p>
          </Section>
          <Section title="Watch a video">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(d.videoQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Video className="h-4 w-4" /> Search YouTube
            </a>
          </Section>
          <Section title="Need help?">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            >
              Ask the mentor
            </Link>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
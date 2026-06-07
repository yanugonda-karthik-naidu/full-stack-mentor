import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { MODULES, ROADMAP_DAYS, moduleDays } from "@/lib/datasets/roadmap";
import { currentDayNumber, loadProgress } from "@/lib/storage";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "120-Day Roadmap — Learn2Compile" },
      { name: "description", content: "Your complete beginner-to-job Java Full Stack roadmap." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const [day, setDay] = useState(1);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setDay(currentDayNumber());
    setCompleted(loadProgress().completedTopics);
  }, []);

  return (
    <PageShell
      title="120-Day Roadmap"
      description={`From complete beginner to Java Full Stack job-ready. You're on day ${day} of ${ROADMAP_DAYS.length}.`}
    >
      <div className="space-y-8">
        {MODULES.map((m, mi) => {
          const days = moduleDays(m);
          return (
            <section key={m}>
              <div className="mb-3 flex items-baseline gap-3">
                <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Module {mi + 1}
                </span>
                <h2 className="font-display text-xl font-semibold">{m}</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {days.map((d) => {
                  const isDone = !!completed[String(d.day)];
                  const isToday = d.day === day;
                  const isFuture = d.day > day;
                  return (
                    <Link
                      key={d.day}
                      to="/roadmap/$day"
                      params={{ day: String(d.day) }}
                      className={`group relative rounded-lg border p-3 transition-colors ${
                        isToday
                          ? "border-primary bg-primary/5"
                          : isDone
                            ? "border-accent/40 bg-accent/5"
                            : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Day {d.day}
                        </span>
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-accent" />
                        ) : isFuture ? (
                          <Lock className="h-3 w-3 text-muted-foreground/60" />
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-medium">
                        {d.topic}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
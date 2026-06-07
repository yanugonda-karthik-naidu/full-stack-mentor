import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageSquare, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/PageShell";
import { Checkbox } from "@/components/ui/checkbox";
import { getDay } from "@/lib/datasets/roadmap";
import {
  currentDayNumber,
  loadProgress,
  loadTasks,
  saveProgress,
  saveTasks,
  todayKey,
} from "@/lib/storage";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today's Tasks — Learn2Compile" },
      { name: "description", content: "Your exact study plan for today." },
    ],
  }),
  component: TodayPage,
});

const TASK_KEYS = [
  { id: "learn", label: "Watch / read today's topic" },
  { id: "practice", label: "Complete today's practice" },
  { id: "assignment", label: "Finish today's assignment" },
  { id: "interview", label: "Review today's interview questions" },
];

function TodayPage() {
  const [day, setDay] = useState(1);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDay(currentDayNumber());
    setDone(loadTasks()[todayKey()] ?? {});
  }, []);

  const today = getDay(day);

  const toggle = (id: string, value: boolean) => {
    const next = { ...done, [id]: value };
    setDone(next);
    const all = loadTasks();
    all[todayKey()] = next;
    saveTasks(all);

    const allDone = TASK_KEYS.every((t) => next[t.id]);
    if (allDone) {
      const prog = loadProgress();
      if (!prog.completedDays.includes(day)) {
        prog.completedDays.push(day);
      }
      prog.completedTopics[String(day)] = true;
      prog.streak = (prog.streak || 0) + 1;
      prog.lastActive = todayKey();
      saveProgress(prog);
      toast.success(`Day ${day} complete! Streak: ${prog.streak}🔥`);
    }
  };

  return (
    <PageShell
      title={`Today — Day ${day}`}
      description={`${today.module} · ${today.topic}`}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Block title="Today's Learning">
            <p className="text-sm text-muted-foreground">Topic</p>
            <p className="font-display text-lg">{today.topic}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {today.subtopics.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(today.videoQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Video className="h-4 w-4" />
              Watch tutorial videos
            </a>
          </Block>

          <Block title="Today's Practice">
            <ul className="space-y-2 text-sm">
              {today.practice.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Today's Assignment">
            <p className="text-sm">{today.assignment}</p>
          </Block>

          <Block title="Today's Interview Questions">
            <ul className="space-y-2 text-sm">
              {today.interviewQuestions.map((q) => (
                <li key={q} className="rounded-lg border border-border/60 bg-secondary/50 p-3">
                  {q}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <div className="space-y-4">
          <Block title="Checklist">
            <p className="text-xs text-muted-foreground">
              Estimated study time: {today.duration}
            </p>
            <div className="mt-3 space-y-2">
              {TASK_KEYS.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-card p-3 hover:bg-accent/5"
                >
                  <Checkbox
                    checked={!!done[t.id]}
                    onCheckedChange={(v) => toggle(t.id, !!v)}
                  />
                  <span className={done[t.id] ? "text-muted-foreground line-through" : ""}>
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </Block>

          <Block title="Stuck?">
            <p className="text-sm text-muted-foreground">
              Ask your mentor anything about today's topic.
            </p>
            <Link
              to="/chat"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with mentor
            </Link>
          </Block>
        </div>
      </div>
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
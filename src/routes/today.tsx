import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Compass,
  MessageSquare,
  NotebookPen,
  Sparkles,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/PageShell";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getDay } from "@/lib/datasets/roadmap";
import {
  computePillars,
  gapTopics,
  recommendationFor,
  topGaps,
} from "@/lib/job-readiness";
import {
  currentDayNumber,
  getJournal,
  loadProgress,
  loadTasks,
  saveProgress,
  saveTasks,
  todayKey,
  upsertJournal,
  yesterdayKey,
  type JournalEntry,
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
  { id: "gapFix", label: "Bonus: close your top skill gap" },
];

function TodayPage() {
  const [day, setDay] = useState(1);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [yesterdayEntry, setYesterdayEntry] = useState<JournalEntry | null>(null);
  const [journalCompleted, setJournalCompleted] = useState("");
  const [journalBlocker, setJournalBlocker] = useState("");
  const [journalFocus, setJournalFocus] = useState("");
  const [journalMood, setJournalMood] = useState<JournalEntry["mood"]>("");
  const [savedJournal, setSavedJournal] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    setDay(currentDayNumber());
    setDone(loadTasks()[todayKey()] ?? {});
    setProgress(loadProgress());
    setYesterdayEntry(getJournal(yesterdayKey()) ?? null);
    const existing = getJournal(todayKey());
    if (existing) {
      setJournalCompleted(existing.completed);
      setJournalBlocker(existing.blocker);
      setJournalFocus(existing.tomorrowFocus);
      setJournalMood(existing.mood);
      setSavedJournal(true);
    }
  }, []);

  const today = getDay(day);
  const pillars = useMemo(() => computePillars(progress), [progress]);
  const gaps = useMemo(() => topGaps(pillars), [pillars]);
  const topGap = gaps[0];

  const toggle = (id: string, value: boolean) => {
    const next = { ...done, [id]: value };
    setDone(next);
    const all = loadTasks();
    all[todayKey()] = next;
    saveTasks(all);

    const core = TASK_KEYS.filter((t) => t.id !== "gapFix");
    const allDone = core.every((t) => next[t.id]);
    if (allDone) {
      const prog = loadProgress();
      if (!prog.completedDays.includes(day)) {
        prog.completedDays.push(day);
      }
      prog.completedTopics[String(day)] = true;
      prog.streak = (prog.streak || 0) + 1;
      prog.lastActive = todayKey();
      saveProgress(prog);
      setProgress(prog);
      toast.success(`Day ${day} complete! Streak: ${prog.streak}🔥`);
    }
  };

  const saveJournal = () => {
    const entry: JournalEntry = {
      date: todayKey(),
      completed: journalCompleted.trim(),
      blocker: journalBlocker.trim(),
      tomorrowFocus: journalFocus.trim(),
      mood: journalMood,
    };
    upsertJournal(entry);
    setSavedJournal(true);
    toast.success("Journal saved. Tomorrow is now adjusted around your blockers.");
  };

  // If yesterday had a blocker but today's focus is empty, auto-suggest it.
  const suggestedFocus = useMemo(() => {
    if (journalFocus) return "";
    if (yesterdayEntry?.blocker) {
      return `Resolve yesterday's blocker: ${yesterdayEntry.blocker}`;
    }
    if (topGap) {
      return `Close gap in ${topGap.name} — ${recommendationFor(topGap.name)}`;
    }
    return "";
  }, [journalFocus, yesterdayEntry, topGap]);

  return (
    <PageShell
      title={`Today — Day ${day}`}
      description={`${today.module} · ${today.topic}`}
    >
      {yesterdayEntry ? (
        <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
            <Compass className="h-3.5 w-3.5" /> Yesterday's recap
          </div>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
            <p>
              <strong>Done:</strong>{" "}
              <span className="text-muted-foreground">
                {yesterdayEntry.completed || "—"}
              </span>
            </p>
            <p>
              <strong>Blocker:</strong>{" "}
              <span className="text-muted-foreground">
                {yesterdayEntry.blocker || "none"}
              </span>
            </p>
            <p>
              <strong>Today's planned focus:</strong>{" "}
              <span className="text-muted-foreground">
                {yesterdayEntry.tomorrowFocus || "—"}
              </span>
            </p>
          </div>
        </div>
      ) : null}

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

          {topGap ? (
            <Block title="Bonus mission · close your top gap">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-base font-semibold">{topGap.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Currently at {topGap.pct}%. {recommendationFor(topGap.name)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {gapTopics(topGap.name).map((t) => (
                  <Link
                    key={t}
                    to="/practice"
                    className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs hover:bg-accent/10"
                  >
                    Practice {t}
                  </Link>
                ))}
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
                >
                  <Sparkles className="h-3 w-3" /> Ask mentor a 20-min drill
                </Link>
              </div>
            </Block>
          ) : null}

          <Block title={savedJournal ? "Daily accountability · saved ✓" : "Daily accountability"}>
            <p className="text-xs text-muted-foreground">
              Two minutes. Your mentor uses this to adjust tomorrow's plan.
            </p>
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What did you actually complete today?
              </label>
              <Textarea
                rows={2}
                value={journalCompleted}
                onChange={(e) => setJournalCompleted(e.target.value)}
                placeholder="e.g. Watched OOP video, solved 3 array problems"
              />
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What blocked you? (concept, bug, time, motivation)
              </label>
              <Textarea
                rows={2}
                value={journalBlocker}
                onChange={(e) => setJournalBlocker(e.target.value)}
                placeholder="e.g. Got stuck on HashMap iteration"
              />
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tomorrow's #1 focus
                {suggestedFocus ? (
                  <button
                    type="button"
                    onClick={() => setJournalFocus(suggestedFocus)}
                    className="ml-2 rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent hover:bg-accent/25"
                  >
                    Use mentor suggestion
                  </button>
                ) : null}
              </label>
              <Textarea
                rows={2}
                value={journalFocus}
                onChange={(e) => setJournalFocus(e.target.value)}
                placeholder={suggestedFocus || "What will you finish tomorrow?"}
              />
              <div className="flex flex-wrap gap-2">
                {(["great", "ok", "rough"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setJournalMood(m)}
                    className={`rounded-full border px-3 py-1 text-xs capitalize ${
                      journalMood === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {m === "great" ? "💪 Great" : m === "ok" ? "👍 OK" : "😩 Rough"}
                  </button>
                ))}
              </div>
              <Button onClick={saveJournal} className="gap-2">
                <NotebookPen className="h-4 w-4" /> Save and adjust tomorrow
              </Button>
            </div>
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
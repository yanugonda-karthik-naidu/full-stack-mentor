import { createFileRoute } from "@tanstack/react-router";
import { Flame, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { ROADMAP_DAYS } from "@/lib/datasets/roadmap";
import { currentDayNumber, loadProgress } from "@/lib/storage";

export const Route = createFileRoute("/motivation")({
  component: MotivationPage,
});

const QUOTES = [
  "Small daily steps beat occasional sprints.",
  "You are not behind. You are exactly where you started — and moving.",
  "1 hour today > 8 hours next week that never happens.",
  "Confused is the feeling right before clarity. Keep going.",
  "Every senior developer was once a beginner who didn't quit.",
];

function MotivationPage() {
  const [day, setDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    setDay(currentDayNumber());
    const p = loadProgress();
    setStreak(p.streak);
    setCompleted(Object.values(p.completedTopics).filter(Boolean).length);
  }, []);

  const messages: string[] = [];
  if (streak >= 5) messages.push(`You're on a ${streak}-day streak — momentum is your superpower.`);
  if (completed > 0) messages.push(`You've completed ${completed} topics. That's ${completed} more than yesterday's you.`);
  if (day <= 30) messages.push("You're in the foundation phase. Every line of code now compounds for years.");
  else if (day <= 80) messages.push("You're past the hardest part. Stack what you've built.");
  else messages.push(`Only ${Math.max(0, ROADMAP_DAYS.length - day)} days to job-ready. Finish strong.`);

  return (
    <PageShell title="Motivation Center" description="A small refuel for the long road.">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Flame} label="Streak" value={`${streak} days`} />
        <Stat icon={Trophy} label="Topics done" value={`${completed}`} />
        <Stat icon={Sparkles} label="Current day" value={`${day} / ${ROADMAP_DAYS.length}`} />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-semibold">Today's reminders</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {messages.map((m) => (
            <li key={m} className="rounded-md border border-accent/30 bg-accent/5 p-3">
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 rounded-xl p-6 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <p className="font-display text-lg font-semibold">
          “{QUOTES[day % QUOTES.length]}”
        </p>
      </div>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
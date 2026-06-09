import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { COMPANIES } from "@/lib/datasets/companies";
import { INTERVIEW_BANK, type InterviewQuestion } from "@/lib/datasets/interview";

export const Route = createFileRoute("/companies/$companyId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.companyId} Mock Interview — Learn2Compile` },
      {
        name: "description",
        content: `Role-based timed mock interview for ${params.companyId} Java Full Stack freshers with feedback.`,
      },
    ],
  }),
  loader: ({ params }) => {
    const company = COMPANIES.find(
      (c) => c.name.toLowerCase() === params.companyId.toLowerCase(),
    );
    if (!company) throw notFound();
    return { company };
  },
  component: MockInterviewPage,
  notFoundComponent: () => (
    <PageShell title="Company not found" description="">
      <Link to="/companies" className="text-primary hover:underline">
        ← Back to companies
      </Link>
    </PageShell>
  ),
});

const ROLES = [
  { id: "tech-mcq", label: "Online Test (MCQ + Output)", minutes: 10, count: 5 },
  { id: "tech", label: "Technical Round", minutes: 15, count: 5 },
  { id: "hr", label: "HR Round", minutes: 10, count: 4 },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

function pickQuestions(company: string, role: RoleId, count: number): InterviewQuestion[] {
  const profile = COMPANIES.find((c) => c.name === company);
  const mustKnow = profile?.mustKnow.map((s) => s.toLowerCase()) ?? [];

  let pool: InterviewQuestion[];
  if (role === "hr") {
    pool = INTERVIEW_BANK.filter((q) => q.category === "HR");
  } else if (role === "tech-mcq") {
    pool = INTERVIEW_BANK.filter(
      (q) => q.difficulty === "Easy" && q.category !== "HR",
    );
  } else {
    pool = INTERVIEW_BANK.filter((q) => q.category !== "HR");
  }

  const scored = pool.map((q) => {
    let score = 0;
    for (const m of mustKnow) {
      if (q.category.toLowerCase().includes(m)) score += 2;
      if (q.question.toLowerCase().includes(m)) score += 1;
    }
    return { q, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, count).map((s) => s.q);
  // pad with remaining bank if too few
  if (top.length < count) {
    for (const q of pool) {
      if (top.length >= count) break;
      if (!top.includes(q)) top.push(q);
    }
  }
  return top;
}

function MockInterviewPage() {
  const { company } = Route.useLoaderData();
  const [role, setRole] = useState<RoleId>("tech");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfScores, setSelfScores] = useState<Record<string, "pass" | "fail" | "">>({});
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"setup" | "live" | "review">("setup");

  const cfg = ROLES.find((r) => r.id === role)!;
  const totalSeconds = cfg.minutes * 60;

  useEffect(() => {
    if (!running || phase !== "live") return;
    if (seconds >= totalSeconds) {
      setRunning(false);
      setPhase("review");
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s + 1), 1000);
    return () => clearTimeout(id);
  }, [running, seconds, totalSeconds, phase]);

  const start = () => {
    const qs = pickQuestions(company.name, role, cfg.count);
    setQuestions(qs);
    setIdx(0);
    setAnswers({});
    setSelfScores({});
    setSeconds(0);
    setRunning(true);
    setPhase("live");
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
    } else {
      setRunning(false);
      setPhase("review");
    }
  };

  const reset = () => {
    setPhase("setup");
    setSeconds(0);
    setRunning(false);
  };

  const passCount = useMemo(
    () => Object.values(selfScores).filter((v) => v === "pass").length,
    [selfScores],
  );
  const scorePct = questions.length
    ? Math.round((passCount / questions.length) * 100)
    : 0;

  const feedback = useMemo(() => {
    if (phase !== "review") return null;
    const weakTopics = questions
      .filter((q) => selfScores[q.id] !== "pass")
      .map((q) => q.category);
    const unique = Array.from(new Set(weakTopics));
    const tone =
      scorePct >= 80
        ? "Strong round — you'd likely clear this stage."
        : scorePct >= 50
          ? "Decent. Polish your weak topics and try again in 2 days."
          : "Needs work. Revise fundamentals before re-attempting.";
    return { weak: unique, tone };
  }, [phase, questions, selfScores, scorePct]);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <PageShell
      title={`${company.name} · Mock Interview`}
      description={company.pattern}
    >
      <div className="mb-4">
        <Link
          to="/companies"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to companies
        </Link>
      </div>

      {phase === "setup" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Pick a round
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    role === r.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/50"
                  }`}
                >
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {r.minutes} min · {r.count} questions
                  </p>
                </button>
              ))}
            </div>
            <Button onClick={start} className="mt-4 gap-2">
              <Mic className="h-4 w-4" /> Start mock interview
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 text-sm">
            <p className="font-semibold">How it works</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                Questions are auto-picked from this company's must-know skills (
                {company.mustKnow.join(", ")}).
              </li>
              <li>The timer simulates real interview pressure. Answer out loud or type.</li>
              <li>After each question, compare with the model answer and mark pass/fail.</li>
              <li>At the end, review your score, weak topics, and the next-step plan.</li>
            </ul>
          </div>
        </div>
      ) : null}

      {phase === "live" && questions[idx] ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Question {idx + 1} of {questions.length} · {questions[idx].category} ·{" "}
                {questions[idx].difficulty}
              </p>
              <p className="mt-1 flex items-center gap-2 font-display text-xl font-semibold">
                <Clock className="h-4 w-4" /> {minutes}:{secs}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRunning((r) => !r)}
                className="gap-1"
              >
                {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {running ? "Pause" : "Resume"}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
                <RotateCcw className="h-3 w-3" /> Restart
              </Button>
            </div>
          </div>
          <Progress value={(seconds / totalSeconds) * 100} className="h-1.5" />

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-lg font-semibold">{questions[idx].question}</p>
            <Textarea
              rows={5}
              placeholder="Type your answer (or just rehearse out loud, then move on)"
              value={answers[questions[idx].id] ?? ""}
              onChange={(e) =>
                setAnswers({ ...answers, [questions[idx].id]: e.target.value })
              }
              className="mt-3"
            />

            <details className="mt-4 rounded-lg border border-border/70 bg-secondary/30 p-3 text-sm">
              <summary className="cursor-pointer font-semibold">Reveal model answer</summary>
              <p className="mt-2 text-muted-foreground">{questions[idx].answer}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant={selfScores[questions[idx].id] === "pass" ? "default" : "outline"}
                  onClick={() =>
                    setSelfScores({ ...selfScores, [questions[idx].id]: "pass" })
                  }
                  className="gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" /> I nailed it
                </Button>
                <Button
                  size="sm"
                  variant={selfScores[questions[idx].id] === "fail" ? "default" : "outline"}
                  onClick={() =>
                    setSelfScores({ ...selfScores, [questions[idx].id]: "fail" })
                  }
                  className="gap-1"
                >
                  <XCircle className="h-3 w-3" /> Need to revise
                </Button>
              </div>
            </details>

            <div className="mt-4 flex justify-end">
              <Button onClick={next} className="gap-1">
                {idx === questions.length - 1 ? "Finish" : "Next"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {phase === "review" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Your mock score
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold">
                {passCount}/{questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{scorePct}%</span>
            </div>
            <Progress value={scorePct} className="mt-2 h-2" />
            {feedback ? (
              <p className="mt-3 text-sm">{feedback.tone}</p>
            ) : null}
          </div>

          {feedback?.weak.length ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
              <p className="font-semibold">Topics to revise</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {feedback.weak.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/practice"
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Drill these on Practice Center
                </Link>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  <Sparkles className="h-3 w-3" /> Ask mentor for a 30-min plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5 text-sm">
              Strong round — book a real {company.name} application this week.
            </div>
          )}

          <Button onClick={reset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Run another round
          </Button>
        </div>
      ) : null}
    </PageShell>
  );
}
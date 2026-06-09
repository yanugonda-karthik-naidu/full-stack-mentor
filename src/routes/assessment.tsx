import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, RefreshCw, Sparkles, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  currentDayNumber,
  loadProgress,
  recordAssessment,
  weekKey,
  type ProgressState,
} from "@/lib/storage";
import { getDay } from "@/lib/datasets/roadmap";
import {
  computePillars,
  gapTopics,
  recommendationFor,
  topGaps,
} from "@/lib/job-readiness";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Weekly Assessment — Learn2Compile" },
      {
        name: "description",
        content:
          "Weekly Java Full Stack assessment with MCQs, output questions and a coding task.",
      },
    ],
  }),
  component: AssessmentPage,
});

type MCQ = {
  q: string;
  options: string[];
  answer: number;
  topic: string;
  type: "MCQ" | "Output" | "Coding";
};

const BANK: MCQ[] = [
  {
    type: "MCQ",
    topic: "Variables",
    q: "Which of these is NOT a primitive type in Java?",
    options: ["int", "boolean", "String", "double"],
    answer: 2,
  },
  {
    type: "MCQ",
    topic: "OOP",
    q: "Which pillar of OOP hides internal state behind methods?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    answer: 1,
  },
  {
    type: "Output",
    topic: "Loops",
    q: "Output of: for(int i=1;i<=3;i++) System.out.print(i*2);",
    options: ["123", "246", "2 4 6", "024"],
    answer: 1,
  },
  {
    type: "MCQ",
    topic: "Collections",
    q: "Which collection stores unique elements without ordering?",
    options: ["ArrayList", "LinkedList", "HashSet", "TreeMap"],
    answer: 2,
  },
  {
    type: "Output",
    topic: "Strings",
    q: "Output of: \"Java\".substring(1,3)",
    options: ["Ja", "av", "ava", "va"],
    answer: 1,
  },
  {
    type: "MCQ",
    topic: "SQL",
    q: "Which clause filters groups AFTER GROUP BY?",
    options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
    answer: 1,
  },
  {
    type: "MCQ",
    topic: "Spring Boot",
    q: "Which annotation marks a REST controller?",
    options: ["@Component", "@Service", "@RestController", "@Entity"],
    answer: 2,
  },
  {
    type: "Output",
    topic: "Arrays",
    q: "Length of: int[] a = {1,2,3,4};  a.length",
    options: ["3", "4", "5", "Error"],
    answer: 1,
  },
  {
    type: "MCQ",
    topic: "Exception Handling",
    q: "Which block always executes whether or not an exception is caught?",
    options: ["try", "catch", "finally", "throw"],
    answer: 2,
  },
  {
    type: "MCQ",
    topic: "OOP",
    q: "Which keyword prevents method overriding?",
    options: ["static", "final", "private", "abstract"],
    answer: 1,
  },
  {
    type: "Output",
    topic: "Collections",
    q: "Result of: new HashSet<>(Arrays.asList(1,2,2,3)).size()",
    options: ["2", "3", "4", "Error"],
    answer: 1,
  },
  {
    type: "MCQ",
    topic: "JavaScript",
    q: "Which keyword creates a block-scoped, immutable binding?",
    options: ["var", "let", "const", "static"],
    answer: 2,
  },
  {
    type: "MCQ",
    topic: "Spring Boot",
    q: "Which annotation maps a class to a JPA table?",
    options: ["@Service", "@Entity", "@Repository", "@RestController"],
    answer: 1,
  },
  {
    type: "Coding",
    topic: "Arrays",
    q: "Best approach to find the largest element in an int[] of size N?",
    options: [
      "Sort then take last — O(N log N)",
      "Single pass tracking max — O(N)",
      "Nested loops comparing pairs — O(N²)",
      "Recursion only",
    ],
    answer: 1,
  },
  {
    type: "Coding",
    topic: "SQL",
    q: "Find 2nd highest salary — most readable approach?",
    options: [
      "SELECT MAX(salary) FROM emp",
      "SELECT salary FROM emp ORDER BY salary DESC LIMIT 1",
      "SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp)",
      "SELECT salary FROM emp WHERE rownum = 2",
    ],
    answer: 2,
  },
];

const QUESTIONS_PER_ASSESSMENT = 8;

function pickQuestions(progress: ProgressState, day: number): number[] {
  const today = getDay(day);
  const pillars = computePillars(progress);
  const gaps = topGaps(pillars);
  const gapTopicNames = new Set<string>(gaps.flatMap((g) => gapTopics(g.name)));
  // Always include this week's topic
  gapTopicNames.add(today.topic);

  const scored = BANK.map((q, i) => {
    let score = 0;
    for (const t of gapTopicNames) {
      if (q.topic.toLowerCase().includes(t.toLowerCase())) score += 3;
      if (t.toLowerCase().includes(q.topic.toLowerCase())) score += 2;
    }
    if (today.module.toLowerCase().includes(q.topic.toLowerCase())) score += 1;
    return { i, score };
  });

  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, QUESTIONS_PER_ASSESSMENT).map((s) => s.i);
  if (top.length < QUESTIONS_PER_ASSESSMENT) {
    for (let i = 0; i < BANK.length && top.length < QUESTIONS_PER_ASSESSMENT; i++) {
      if (!top.includes(i)) top.push(i);
    }
  }
  return top;
}

function nextWeekPlan(args: {
  weakTopics: string[];
  pillars: ReturnType<typeof computePillars>;
  nextTopic: string;
}): string[] {
  const { weakTopics, pillars, nextTopic } = args;
  const gaps = topGaps(pillars);
  const focus = gaps[0]?.name ?? "Java Core";
  const plan: string[] = [];
  if (weakTopics.length) {
    plan.push(
      `Day 1–2: Revise ${weakTopics.slice(0, 3).join(", ")} (theory + 5 problems each).`,
    );
  } else {
    plan.push("Day 1–2: Speed-run revision of this module's tricky parts.");
  }
  plan.push(`Day 3: Deep-work on ${focus} — ${recommendationFor(focus)}`);
  plan.push(`Day 4: 1-hour coding sprint — 5 HackerRank + 2 LeetCode (Easy/Medium).`);
  plan.push(`Day 5: Start next topic — ${nextTopic}. Build a tiny demo.`);
  plan.push("Day 6: Mock interview — explain your current project for 5 minutes out loud.");
  plan.push("Day 7: Reflect — push code to GitHub, update resume bullet, take next week's quiz.");
  return plan;
}

function AssessmentPage() {
  const [day, setDay] = useState(1);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [pickedIdx, setPickedIdx] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const d = currentDayNumber();
    setDay(d);
    const p = loadProgress();
    setProgress(p);
    setPickedIdx(pickQuestions(p, d));
  }, []);

  const today = getDay(day);
  const nextDay = getDay(Math.min(120, day + 7));
  const week = Math.ceil(day / 7);

  const picked = useMemo(() => pickedIdx.map((i) => BANK[i]), [pickedIdx]);

  const score = useMemo(
    () => picked.reduce((s, q, i) => (answers[i] === q.answer ? s + 1 : s), 0),
    [answers, picked],
  );
  const pct = picked.length ? Math.round((score / picked.length) * 100) : 0;

  const weakTopics = useMemo(() => {
    if (!submitted) return [];
    const wrong = picked.filter((q, i) => answers[i] !== q.answer).map((q) => q.topic);
    return Array.from(new Set(wrong));
  }, [answers, submitted, picked]);

  const strongTopics = useMemo(() => {
    if (!submitted) return [];
    const right = picked.filter((q, i) => answers[i] === q.answer).map((q) => q.topic);
    return Array.from(new Set(right));
  }, [answers, submitted, picked]);

  const pillars = useMemo(() => computePillars(progress), [progress]);
  const plan = useMemo(
    () =>
      submitted
        ? nextWeekPlan({ weakTopics, pillars, nextTopic: nextDay.topic })
        : [],
    [submitted, weakTopics, pillars, nextDay.topic],
  );

  const handleSubmit = () => {
    setSubmitted(true);
    recordAssessment({
      weekKey: weekKey(day),
      date: new Date().toISOString().slice(0, 10),
      score,
      total: picked.length,
      weakTopics,
      strongTopics,
    });
  };

  const regenerate = () => {
    setAnswers({});
    setSubmitted(false);
    setPickedIdx(pickQuestions(progress, day));
  };

  return (
    <PageShell
      title={`Week ${week} Assessment · auto-generated`}
      description={`Questions picked from your current roadmap position (${today.module} · ${today.topic}) and your weakest pillars.`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-secondary/40 p-3 text-xs">
        <span className="text-muted-foreground">
          {picked.length} questions · weighted toward your skill gaps and this week's module.
        </span>
        <Button variant="outline" size="sm" onClick={regenerate} className="gap-1">
          <RefreshCw className="h-3 w-3" /> Regenerate
        </Button>
      </div>

      {submitted ? (
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Your result
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">
              {score}/{picked.length}
            </span>
            <span className="text-sm text-muted-foreground">{pct}%</span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Block title="Strengths">
              {strongTopics.length ? (
                <ul className="space-y-1 text-sm">
                  {strongTopics.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" /> {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Revise basics first.</p>
              )}
            </Block>
            <Block title="Weak areas">
              {weakTopics.length ? (
                <ul className="space-y-1 text-sm">
                  {weakTopics.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" /> {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">All clear — strong week!</p>
              )}
            </Block>
          </div>

          <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Auto-generated Next Week Plan
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {plan.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-primary">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/practice"
                className="inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Go to Practice Center
              </Link>
              <Link
                to="/job-ready"
                className="inline-flex rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
              >
                See full skill-gap report
              </Link>
              <Link
                to="/chat"
                className="inline-flex rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
              >
                Ask mentor
              </Link>
            </div>
          </div>

          <Button
            variant="ghost"
            className="mt-4"
            onClick={regenerate}
          >
            Retake assessment
          </Button>
        </div>
      ) : null}

      <div className="space-y-4">
        {picked.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                {q.type}
              </span>
              <span className="text-muted-foreground">{q.topic}</span>
            </div>
            <p className="mt-2 text-sm font-medium">
              {i + 1}. {q.q}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[i] === oi;
                const correct = submitted && q.answer === oi;
                const wrong = submitted && chosen && q.answer !== oi;
                return (
                  <button
                    type="button"
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [i]: oi })}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      correct
                        ? "border-accent bg-accent/10"
                        : wrong
                        ? "border-destructive bg-destructive/10"
                        : chosen
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <Button
          className="mt-6"
          disabled={Object.keys(answers).length < picked.length}
          onClick={handleSubmit}
        >
          Submit assessment
        </Button>
      ) : null}
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/30 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
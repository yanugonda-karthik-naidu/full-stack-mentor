import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { currentDayNumber } from "@/lib/storage";
import { getDay } from "@/lib/datasets/roadmap";

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
  type: "MCQ" | "Output";
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
];

function AssessmentPage() {
  const day = currentDayNumber();
  const week = Math.ceil(day / 7);
  const today = getDay(day);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => BANK.reduce((s, q, i) => (answers[i] === q.answer ? s + 1 : s), 0),
    [answers],
  );
  const pct = Math.round((score / BANK.length) * 100);

  const weakTopics = useMemo(() => {
    if (!submitted) return [];
    const wrong = BANK.filter((q, i) => answers[i] !== q.answer).map((q) => q.topic);
    return Array.from(new Set(wrong));
  }, [answers, submitted]);

  const strongTopics = useMemo(() => {
    if (!submitted) return [];
    const right = BANK.filter((q, i) => answers[i] === q.answer).map((q) => q.topic);
    return Array.from(new Set(right));
  }, [answers, submitted]);

  return (
    <PageShell
      title={`Week ${week} Assessment`}
      description={`Quick check on what you've learned. Current focus: ${today.module}.`}
    >
      {submitted ? (
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Your result
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">
              {score}/{BANK.length}
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

          <div className="mt-5 rounded-lg border border-border/70 bg-secondary/40 p-4 text-sm">
            <p className="font-semibold">Recommendation for next week</p>
            <p className="mt-1 text-muted-foreground">
              {weakTopics.length
                ? `Revise ${weakTopics.join(", ")}. Then attempt 5 practice problems each.`
                : `Move ahead. Next focus: ${today.topic}.`}
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                to="/practice"
                className="inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Go to Practice Center
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
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Retake assessment
          </Button>
        </div>
      ) : null}

      <div className="space-y-4">
        {BANK.map((q, i) => (
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
          disabled={Object.keys(answers).length < BANK.length}
          onClick={() => setSubmitted(true)}
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
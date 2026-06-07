import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { INTERVIEW_BANK, INTERVIEW_CATEGORIES } from "@/lib/datasets/interview";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Interview Trainer — Learn2Compile" },
      { name: "description", content: "Practice technical and HR interview questions." },
    ],
  }),
  component: InterviewPage,
});

function InterviewPage() {
  const [cat, setCat] = useState<string>("All");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const list = cat === "All" ? INTERVIEW_BANK : INTERVIEW_BANK.filter((q) => q.category === cat);

  return (
    <PageShell
      title="Interview Trainer"
      description="Click a question, think through your answer, then reveal the model answer."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...INTERVIEW_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((q) => {
          const open = !!revealed[q.id];
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{q.category}</span>
                    <span>·</span>
                    <span>{q.difficulty}</span>
                  </div>
                  <p className="mt-2 font-display text-base">{q.question}</p>
                </div>
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [q.id]: !open }))}
                  className="shrink-0 rounded-md border border-border bg-secondary px-3 py-1 text-xs font-semibold hover:bg-accent/10"
                >
                  {open ? "Hide" : "Reveal"}
                </button>
              </div>
              {open ? (
                <p className="mt-3 rounded-md border border-border/60 bg-secondary/40 p-3 text-sm leading-relaxed">
                  {q.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
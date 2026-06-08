import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { PRACTICE_BANK } from "@/lib/datasets/practice";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice Center — Learn2Compile" },
      {
        name: "description",
        content:
          "Topic-wise Java and full-stack coding practice with Easy, Medium and Hard problems plus HackerRank and LeetCode pointers.",
      },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const [q, setQ] = useState("");
  const topics = Object.entries(PRACTICE_BANK).filter(([name]) =>
    name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell
      title="Practice Center"
      description="Pick a topic and code. Easy → Medium → Hard. Then attempt the platform problems."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search topic (Arrays, OOP, SQL…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Link
          to="/chat"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Sparkles className="h-4 w-4" /> Ask mentor for help
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {topics.map(([name, p]) => (
          <div key={name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{name}</h2>
              <Code2 className="h-4 w-4 text-accent" />
            </div>

            <Section title="Easy" tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              {p.easy.map((x) => (
                <Item key={x}>{x}</Item>
              ))}
            </Section>

            <Section title="Medium" tone="bg-amber-500/15 text-amber-700 dark:text-amber-300">
              {p.medium.map((x) => (
                <Item key={x}>{x}</Item>
              ))}
            </Section>

            {p.hard && p.hard.length > 0 ? (
              <Section title="Hard" tone="bg-rose-500/10 text-rose-700 dark:text-rose-300">
                {p.hard.map((x) => (
                  <Item key={x}>{x}</Item>
                ))}
              </Section>
            ) : null}

            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Platform problems
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {p.platforms.map((plat) => {
                  const isLeet = plat.toLowerCase().includes("leetcode");
                  const isHR = plat.toLowerCase().includes("hackerrank");
                  const url = isLeet
                    ? `https://leetcode.com/problemset/?search=${encodeURIComponent(plat)}`
                    : isHR
                    ? `https://www.hackerrank.com/domains/java`
                    : `https://www.google.com/search?q=${encodeURIComponent(plat)}`;
                  return (
                    <li key={plat}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {plat} <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {topics.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No topic matched. Try Arrays, Strings, OOP, SQL…
        </p>
      ) : null}
    </PageShell>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${tone}`}
      >
        {title}
      </span>
      <ul className="mt-2 space-y-1 text-sm">{children}</ul>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </li>
  );
}
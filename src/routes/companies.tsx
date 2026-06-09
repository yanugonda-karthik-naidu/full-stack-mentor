import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { COMPANIES } from "@/lib/datasets/companies";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Company Preparation — Learn2Compile" },
      {
        name: "description",
        content:
          "Fresher hiring patterns and must-know skills for TCS, Infosys, Wipro, Cognizant, Capgemini, Accenture, HCL and Tech Mahindra.",
      },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  return (
    <PageShell
      title="Company Preparation"
      description="Know exactly what each company expects from a Java Full Stack fresher — and what to skip."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {COMPANIES.map((c) => (
          <article
            key={c.name}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold">{c.name}</h2>
              </div>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask mentor
              </Link>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Interview Pattern
            </p>
            <p className="text-sm">{c.pattern}</p>

            <Bucket
              tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              title="Must Know"
              items={c.mustKnow}
            />
            <Bucket
              tone="bg-amber-500/15 text-amber-700 dark:text-amber-300"
              icon={<AlertCircle className="h-3.5 w-3.5" />}
              title="Good To Know"
              items={c.goodToKnow}
            />
            <Bucket
              tone="bg-rose-500/10 text-rose-700 dark:text-rose-300"
              icon={<XCircle className="h-3.5 w-3.5" />}
              title="Skip For Now"
              items={c.skipForNow}
            />
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Bucket({
  tone,
  icon,
  title,
  items,
}: {
  tone: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="mt-4">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${tone}`}
      >
        {icon}
        {title}
      </span>
      <ul className="mt-2 flex flex-wrap gap-1.5 text-sm">
        {items.map((i) => (
          <li
            key={i}
            className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-xs"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
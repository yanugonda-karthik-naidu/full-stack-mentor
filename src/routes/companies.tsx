import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ListChecks,
  Mic,
  Plus,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANIES } from "@/lib/datasets/companies";
import {
  loadApplications,
  loadCompanyPrep,
  saveApplications,
  saveCompanyPrep,
  type Application,
  type ApplicationStatus,
} from "@/lib/storage";

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

const STATUSES: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "OA / Test",
  "Interview",
  "Offer",
  "Rejected",
];

function weeklyChecklist(companyName: string): string[] {
  const c = COMPANIES.find((x) => x.name === companyName);
  if (!c) return [];
  const focus = c.mustKnow.slice(0, 3).join(", ");
  return [
    `Revise top must-know skills (${focus}) for 3 hrs total this week`,
    "Solve 10 coding problems matching this company's pattern",
    "Polish 1 project explanation: problem → tech → your role → impact",
    "Write down 5 likely technical questions and answer them out loud",
    "Prepare 2 HR answers: 'Tell me about yourself' + 'Why this company?'",
    "Submit application + update tracker entry below",
  ];
}

function materialsFor(companyName: string): { label: string; href: string }[] {
  const c = COMPANIES.find((x) => x.name === companyName);
  const skills = c?.mustKnow.join(" ") ?? "Java OOP SQL";
  return [
    {
      label: "Latest hiring pattern (Google)",
      href: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} fresher interview process 2025`)}`,
    },
    {
      label: "Past interview questions (Glassdoor)",
      href: `https://www.glassdoor.co.in/Search/results.htm?keyword=${encodeURIComponent(companyName)}`,
    },
    {
      label: "Topic-based practice on HackerRank",
      href: `https://www.hackerrank.com/domains/java`,
    },
    {
      label: `LeetCode warm-up for ${skills}`,
      href: `https://leetcode.com/problemset/?search=${encodeURIComponent(skills)}`,
    },
  ];
}

function CompaniesPage() {
  const [prep, setPrep] = useState<Record<string, Record<string, boolean>>>({});
  const [apps, setApps] = useState<Application[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("Java Full Stack Developer (Fresher)");

  useEffect(() => {
    setPrep(loadCompanyPrep());
    setApps(loadApplications());
  }, []);

  const toggleTask = (company: string, taskKey: string, value: boolean) => {
    const next = { ...prep, [company]: { ...(prep[company] ?? {}), [taskKey]: value } };
    setPrep(next);
    saveCompanyPrep(next);
  };

  const addApplication = () => {
    if (!newCompany.trim()) return;
    const entry: Application = {
      id: "a_" + Math.random().toString(36).slice(2, 10),
      company: newCompany.trim(),
      role: newRole.trim() || "Java Full Stack Developer (Fresher)",
      status: "Wishlist",
      updatedAt: Date.now(),
    };
    const next = [entry, ...apps];
    setApps(next);
    saveApplications(next);
    setNewCompany("");
  };

  const updateApp = (id: string, patch: Partial<Application>) => {
    const next = apps.map((a) =>
      a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a,
    );
    setApps(next);
    saveApplications(next);
  };

  const removeApp = (id: string) => {
    const next = apps.filter((a) => a.id !== id);
    setApps(next);
    saveApplications(next);
  };

  const stats = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      Wishlist: 0,
      Applied: 0,
      "OA / Test": 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };
    apps.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return counts;
  }, [apps]);

  return (
    <PageShell
      title="Company Preparation"
      description="Weekly checklist, prep materials, application tracking, and mock interviews for each company."
    >
      {/* Application tracker */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-semibold">Application Tracker</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {STATUSES.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-secondary/50 px-2 py-0.5"
              >
                {s}: <strong>{stats[s]}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Input
            placeholder="Company (e.g. TCS, Infosys)"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={addApplication} className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {apps.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No applications yet. Add your first target above.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {apps.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.company}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={a.status}
                    onValueChange={(v) => updateApp(a.id, { status: v as ApplicationStatus })}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeApp(a.id)}
                    aria-label="Remove"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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
              <div className="flex items-center gap-2">
                <Link
                  to="/companies/$companyId"
                  params={{ companyId: c.name }}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground"
                >
                  <Mic className="h-3 w-3" /> Mock Interview
                </Link>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Ask mentor
                </Link>
              </div>
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

            {/* Weekly checklist */}
            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                This week's checklist
              </p>
              <ul className="mt-2 space-y-1.5">
                {weeklyChecklist(c.name).map((task) => {
                  const checked = !!prep[c.name]?.[task];
                  return (
                    <li key={task} className="flex items-start gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => toggleTask(c.name, task, !!v)}
                        className="mt-0.5"
                      />
                      <span
                        className={`text-xs ${
                          checked ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Required materials */}
            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Required materials
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {materialsFor(c.name).map((m) => (
                  <li key={m.label}>
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
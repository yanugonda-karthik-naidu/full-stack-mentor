import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "Placement Mentor — Learn2Compile" },
      { name: "description", content: "Your job search routine, channels, and tracker." },
    ],
  }),
  component: PlacementPage,
});

function PlacementPage() {
  const blocks = [
    {
      title: "Daily routine",
      items: [
        "Apply to 15-20 roles on LinkedIn / Naukri",
        "Send 10 connection notes to recruiters",
        "Ask for 2 referrals at target companies",
        "Solve 1 DSA easy + 1 medium",
        "Revise 1 interview topic",
      ],
    },
    {
      title: "Where to apply",
      items: [
        "LinkedIn Jobs (filter: Entry level, Past 24h)",
        "Naukri.com (premium for freshers helps)",
        "Internshala (internship → conversion)",
        "Company career pages (TCS, Infosys, Wipro, Capgemini, Cognizant, Accenture)",
        "Startup boards: AngelList/Wellfound, YC's WWR",
      ],
    },
    {
      title: "Referrals",
      items: [
        "Find 10 employees at the target company on LinkedIn",
        "Send a personalized note (1-2 lines)",
        "If they reply, share resume + job ID + 1-line pitch",
        "Track every referral in a sheet",
      ],
    },
    {
      title: "Application tracker columns",
      items: ["Company", "Role", "Source", "Applied date", "Referral?", "Status", "Next action"],
    },
  ];
  return (
    <PageShell title="Placement Mentor" description="Treat job search like a daily job. Process beats luck.">
      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">{b.title}</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {b.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
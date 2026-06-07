import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/linkedin")({
  head: () => ({
    meta: [
      { title: "LinkedIn Mentor — Learn2Compile" },
      { name: "description", content: "Make your LinkedIn recruiter-ready." },
    ],
  }),
  component: LinkedinPage,
});

function LinkedinPage() {
  const sections = [
    {
      title: "Headline",
      tip: "Java Full Stack Developer | Spring Boot · MySQL · React | Open to opportunities",
    },
    {
      title: "About",
      tip: "3 short paragraphs: who you are → what you do (stack, projects) → what you want (roles, locations). End with contact email.",
    },
    {
      title: "Featured / Projects",
      tip: "Pin 2 projects with GitHub link + 1-line description + live demo if any.",
    },
    {
      title: "Skills",
      tip: "Top 5: Java, Spring Boot, MySQL, JavaScript, REST APIs. Take LinkedIn skill assessments.",
    },
    {
      title: "Networking",
      tip: "Send 10 personalized connection notes/day to recruiters and devs at target companies.",
    },
    {
      title: "Referral DMs",
      tip: "Short, specific, polite. Mention the role + your fit + ask if they'd refer you.",
    },
  ];
  return (
    <PageShell title="LinkedIn Mentor" description="Turn your profile into a recruiter magnet.">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.tip}</p>
          </div>
        ))}
      </div>
      <Link to="/chat" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Get help writing your headline
      </Link>
    </PageShell>
  );
}
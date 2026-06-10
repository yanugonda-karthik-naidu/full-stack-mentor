import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { MentorLogo } from "@/components/MentorLogo";

export function FloatingMentor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Hide on chat pages — the mentor is already the page.
  if (pathname.startsWith("/chat") || pathname.startsWith("/mentor")) return null;

  return (
    <Link
      to="/mentor"
      aria-label="Open AI Mentor"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-border/60 bg-gradient-to-br from-primary to-accent px-4 py-3 text-primary-foreground shadow-[var(--shadow-mentor,_0_10px_30px_-10px_rgba(0,0,0,0.4))] transition-transform hover:-translate-y-0.5"
    >
      <MentorLogo size={22} />
      <span className="hidden text-sm font-semibold sm:inline">Ask Mentor</span>
      <Sparkles className="h-3.5 w-3.5 opacity-80 transition-transform group-hover:rotate-12" />
    </Link>
  );
}
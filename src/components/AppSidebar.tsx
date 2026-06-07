import {
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChartLine,
  FileText,
  GraduationCap,
  Linkedin,
  Map,
  MessageSquarePlus,
  Plus,
  Sparkle,
  Target,
  Trash2,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MentorLogo } from "@/components/MentorLogo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  deleteThread,
  loadThreads,
  newThreadId,
  upsertThread,
  type ChatThread,
} from "@/lib/storage";

type NavItem = { to: string; label: string; icon: LucideIcon };

const STUDY: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: ChartLine },
  { to: "/today", label: "Today's Tasks", icon: Calendar },
  { to: "/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/projects", label: "Projects", icon: Briefcase },
  { to: "/progress", label: "Progress Tracking", icon: Target },
];

const CAREER: NavItem[] = [
  { to: "/interview", label: "Interview Prep", icon: GraduationCap },
  { to: "/resume", label: "Resume Mentor", icon: FileText },
  { to: "/linkedin", label: "LinkedIn Mentor", icon: Linkedin },
  { to: "/placement", label: "Placement Mentor", icon: BookOpen },
  { to: "/motivation", label: "Motivation", icon: Trophy },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    setThreads(loadThreads());
    const onStorage = () => setThreads(loadThreads());
    window.addEventListener("storage", onStorage);
    window.addEventListener("l2c:threads-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("l2c:threads-changed", onStorage);
    };
  }, []);

  const isActive = (to: string) =>
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));

  const handleNew = () => {
    const id = newThreadId();
    upsertThread({ id, title: "New chat", updatedAt: Date.now(), messages: [] });
    window.dispatchEvent(new Event("l2c:threads-changed"));
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  };

  const handleDelete = (id: string) => {
    deleteThread(id);
    window.dispatchEvent(new Event("l2c:threads-changed"));
    if (pathname.startsWith(`/chat/${id}`)) {
      navigate({ to: "/chat" });
    }
  };

  const recent = useMemo(
    () => [...threads].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 12),
    [threads],
  );

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <MentorLogo size={32} />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold text-sidebar-foreground">
              Learn2Compile
            </span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
              AI Mentor
            </span>
          </div>
        </div>
        <div className="px-2">
          <Button
            onClick={handleNew}
            className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Study</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STUDY.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Career</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CAREER.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Recent Chats</span>
            <button
              type="button"
              onClick={handleNew}
              aria-label="New chat"
              className="rounded-md p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recent.length === 0 ? (
                <p className="px-3 py-2 text-xs text-sidebar-foreground/50">
                  Ask your first question to start a chat.
                </p>
              ) : (
                recent.map((t) => {
                  const active = pathname === `/chat/${t.id}`;
                  return (
                    <SidebarMenuItem key={t.id}>
                      <div
                        className={`group/thread flex w-full items-center gap-1 rounded-md ${
                          active ? "bg-sidebar-accent" : ""
                        }`}
                      >
                        <SidebarMenuButton asChild isActive={active}>
                          <Link
                            to="/chat/$threadId"
                            params={{ threadId: t.id }}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <Sparkle className="h-3.5 w-3.5 shrink-0 text-sidebar-primary" />
                            <span className="truncate text-sm">{t.title || "Untitled"}</span>
                          </Link>
                        </SidebarMenuButton>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id);
                          }}
                          aria-label="Delete chat"
                          className="mr-1 hidden rounded p-1 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-destructive group-hover/thread:block"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 pb-2 text-[11px] text-sidebar-foreground/50">
          Stay consistent. Day-by-day beats burst-and-burnout.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
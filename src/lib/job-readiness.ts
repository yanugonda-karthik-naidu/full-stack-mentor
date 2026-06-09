import { MODULES, ROADMAP_DAYS, moduleDays } from "@/lib/datasets/roadmap";
import { PROJECTS } from "@/lib/datasets/projects";
import type { ProgressState } from "@/lib/storage";

export type Pillar = {
  name: string;
  modules: string[];
  weight: number;
  pct: number;
  done: number;
  total: number;
  label: string;
};

const PILLAR_DEFS: Array<{ name: string; modules: string[]; weight: number }> = [
  {
    name: "Java Core",
    modules: [
      "Java Foundations",
      "Object-Oriented Programming",
      "Exceptions, Collections & Generics",
    ],
    weight: 25,
  },
  { name: "SQL", modules: ["SQL & MySQL"], weight: 15 },
  { name: "Frontend", modules: ["HTML, CSS & JavaScript"], weight: 15 },
  {
    name: "Backend",
    modules: ["Spring Boot & REST APIs", "Full Stack Integration"],
    weight: 20,
  },
  { name: "Projects", modules: ["Capstone Project"], weight: 15 },
  {
    name: "Interview Prep",
    modules: ["Interview Preparation", "Resume, LinkedIn & Placement"],
    weight: 10,
  },
];

export function computePillars(progress: ProgressState): Pillar[] {
  return PILLAR_DEFS.map((p) => {
    if (p.name === "Projects") {
      const total = PROJECTS.length || 8;
      const done = progress.completedProjects.length;
      const pct = Math.min(100, Math.round((done / total) * 100));
      return { ...p, pct, done, total, label: `${done}/${total} projects shipped` };
    }
    const relevantDays = MODULES.filter((m) => p.modules.includes(m)).flatMap((m) =>
      moduleDays(m),
    );
    const total = relevantDays.length;
    const done = relevantDays.filter((d) => progress.completedTopics[String(d.day)]).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { ...p, pct, done, total, label: `${done}/${total} days completed` };
  });
}

export function overallReadiness(pillars: Pillar[]): number {
  return Math.round(pillars.reduce((acc, p) => acc + (p.pct * p.weight) / 100, 0));
}

export function readinessStage(score: number): string {
  if (score < 20) return "Just Starting";
  if (score < 40) return "Foundation Builder";
  if (score < 60) return "Coding Confident";
  if (score < 80) return "Project Ready";
  return "Job Ready";
}

export function topGaps(pillars: Pillar[], n = 3): Pillar[] {
  return pillars.filter((p) => p.pct < 60).sort((a, b) => a.pct - b.pct).slice(0, n);
}

export function recommendationFor(pillar: string): string {
  switch (pillar) {
    case "Java Core":
      return "Lock OOP + Collections; solve 5 problems daily on HackerRank Java.";
    case "SQL":
      return "Practice JOINS + GROUP BY on HackerRank SQL Basic + LeetCode #176.";
    case "Frontend":
      return "Build a portfolio + a ToDo app with HTML/CSS/vanilla JS.";
    case "Backend":
      return "Build one Spring Boot CRUD with JPA + MySQL end-to-end.";
    case "Projects":
      return "Ship one resume-worthy project this month with a GitHub README.";
    case "Interview Prep":
      return "Daily: 5 OOP questions + explain your project out loud.";
    default:
      return "Open the mentor and ask for a focused plan.";
  }
}

export function gapTopics(pillar: string): string[] {
  switch (pillar) {
    case "Java Core":
      return ["OOP", "Collections", "Exception Handling"];
    case "SQL":
      return ["SQL"];
    case "Frontend":
      return ["HTML", "CSS", "JavaScript"];
    case "Backend":
      return ["Spring Boot"];
    case "Projects":
      return ["Mini Project", "Capstone"];
    case "Interview Prep":
      return ["OOP", "HR"];
    default:
      return [];
  }
}

export const TOTAL_DAYS = ROADMAP_DAYS.length;
import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const THREADS_KEY = "l2c.threads.v1";
const PROGRESS_KEY = "l2c.progress.v1";
const TASKS_KEY = "l2c.tasks.v1";
const START_KEY = "l2c.startDate.v1";

export type ProgressState = {
  completedDays: number[];
  completedTopics: Record<string, boolean>;
  completedProjects: string[];
  streak: number;
  lastActive?: string;
  moduleProgress: Record<string, number>;
};

export type DailyTaskState = Record<string, Record<string, boolean>>;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Threads
export function loadThreads(): ChatThread[] {
  return read<ChatThread[]>(THREADS_KEY, []);
}
export function saveThreads(threads: ChatThread[]) {
  write(THREADS_KEY, threads);
}
export function upsertThread(thread: ChatThread) {
  const all = loadThreads().filter((t) => t.id !== thread.id);
  all.unshift(thread);
  saveThreads(all);
}
export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}
export function getThread(id: string): ChatThread | undefined {
  return loadThreads().find((t) => t.id === id);
}
export function newThreadId() {
  return (
    "t_" +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

// Progress
const defaultProgress: ProgressState = {
  completedDays: [],
  completedTopics: {},
  completedProjects: [],
  streak: 0,
  moduleProgress: {},
};

export function loadProgress(): ProgressState {
  return read<ProgressState>(PROGRESS_KEY, defaultProgress);
}
export function saveProgress(p: ProgressState) {
  write(PROGRESS_KEY, p);
}

// Daily tasks: keyed by yyyy-mm-dd then task id
export function loadTasks(): DailyTaskState {
  return read<DailyTaskState>(TASKS_KEY, {});
}
export function saveTasks(t: DailyTaskState) {
  write(TASKS_KEY, t);
}

// Start date
export function getStartDate(): string {
  if (!isBrowser()) return new Date().toISOString().slice(0, 10);
  const existing = window.localStorage.getItem(START_KEY);
  if (existing) return existing;
  const today = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(START_KEY, today);
  return today;
}
export function resetStartDate(date: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(START_KEY, date);
}

export function currentDayNumber(): number {
  const start = new Date(getStartDate());
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
  return Math.min(120, Math.max(1, diff));
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
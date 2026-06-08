// Beginner → Job-Ready learning dependency chain.
// The mentor uses this to recommend the NEXT logical topic and to
// avoid pushing students into advanced areas before fundamentals.

export const LEARNING_CHAIN: string[] = [
  "Variables",
  "Operators",
  "Conditionals",
  "Loops",
  "Arrays",
  "Strings",
  "Methods",
  "OOP",
  "Exception Handling",
  "Collections",
  "File I/O",
  "SQL",
  "HTML",
  "CSS",
  "JavaScript",
  "Spring Boot",
  "REST APIs",
  "JPA / Hibernate",
  "Mini Projects",
  "Full Stack Project",
  "Resume & LinkedIn",
  "Interview Prep",
  "Placement",
];

function norm(s: string) {
  return s.toLowerCase();
}

export function nextInChain(currentTopic: string): string | null {
  const c = norm(currentTopic);
  // fuzzy match: find the chain item that appears in the topic
  let idx = LEARNING_CHAIN.findIndex((t) => c.includes(norm(t)));
  if (idx === -1) {
    // fallback: match by first word
    const first = c.split(/\s+/)[0];
    idx = LEARNING_CHAIN.findIndex((t) => norm(t).startsWith(first));
  }
  if (idx === -1 || idx >= LEARNING_CHAIN.length - 1) return null;
  return LEARNING_CHAIN[idx + 1];
}
// Modular dataset registry. Today these are typed TS modules; tomorrow
// they can be swapped with JSON files (roadmap.json, java_dataset.json,
// sql_dataset.json, practice_dataset.json, companies_dataset.json,
// interview_dataset.json, placement_dataset.json, mentor_rules.json) or
// a remote API / vector DB — without changing call sites.

export { ROADMAP_DAYS, MODULES, getDay, moduleDays } from "./roadmap";
export { PROJECTS, getProject } from "./projects";
export { INTERVIEW_BANK, INTERVIEW_CATEGORIES } from "./interview";
export { PRACTICE_BANK, practiceForTopic } from "./practice";
export { COMPANIES, companyExpectation } from "./companies";
export { LEARNING_CHAIN, nextInChain } from "./prerequisites";

export const DATASET_REGISTRY = {
  roadmap: "src/lib/datasets/roadmap.ts",
  projects: "src/lib/datasets/projects.ts",
  interview: "src/lib/datasets/interview.ts",
  practice: "src/lib/datasets/practice.ts",
  companies: "src/lib/datasets/companies.ts",
  prerequisites: "src/lib/datasets/prerequisites.ts",
} as const;
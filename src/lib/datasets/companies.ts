// Fresher hiring expectations — used by the mentor to classify a topic
// as Must Know / Good To Know / Skip For Now for each company.

export type Expectation = "Must Know" | "Good To Know" | "Skip For Now";

export type CompanyProfile = {
  name: string;
  pattern: string;
  mustKnow: string[];
  goodToKnow: string[];
  skipForNow: string[];
};

export const COMPANIES: CompanyProfile[] = [
  {
    name: "TCS",
    pattern: "NQT (numerical, verbal, programming MCQ) → Technical → HR",
    mustKnow: ["Java", "OOP", "SQL", "Aptitude", "Project explanation"],
    goodToKnow: ["Spring Boot basics", "HTML/CSS/JS"],
    skipForNow: ["Docker", "Kubernetes", "AWS", "Microservices", "System Design"],
  },
  {
    name: "Infosys",
    pattern: "InfyTQ / online test → Technical → HR",
    mustKnow: ["Java", "OOP", "SQL", "DBMS basics", "Project"],
    goodToKnow: ["Spring Boot", "JavaScript", "Data Structures basics"],
    skipForNow: ["Microservices", "Kafka", "Kubernetes"],
  },
  {
    name: "Wipro",
    pattern: "Elite NLTH / WILP test → Technical → HR",
    mustKnow: ["Java", "OOP", "SQL", "Aptitude", "1 strong project"],
    goodToKnow: ["Spring Boot", "REST APIs"],
    skipForNow: ["DevOps", "Cloud beyond basics"],
  },
  {
    name: "Cognizant",
    pattern: "GenC test → Technical → HR",
    mustKnow: ["Java", "OOP", "SQL", "Collections", "Project"],
    goodToKnow: ["Spring Boot", "HTML/CSS/JS"],
    skipForNow: ["Advanced System Design"],
  },
  {
    name: "Capgemini",
    pattern: "Pseudo-code + Game test → Technical → HR",
    mustKnow: ["Java", "OOP", "SQL", "Logical thinking"],
    goodToKnow: ["Spring Boot", "REST APIs"],
    skipForNow: ["Cloud certs at fresher level"],
  },
  {
    name: "Accenture",
    pattern: "Cognitive + Technical + Coding → Communication → HR",
    mustKnow: ["Java", "OOP", "SQL", "Communication"],
    goodToKnow: ["Spring Boot", "JavaScript"],
    skipForNow: ["Kubernetes", "Microservices"],
  },
];

export function companyExpectation(company: string, topic: string): Expectation {
  const c = COMPANIES.find((x) => x.name.toLowerCase() === company.toLowerCase());
  if (!c) return "Good To Know";
  const t = topic.toLowerCase();
  if (c.mustKnow.some((m) => t.includes(m.toLowerCase()))) return "Must Know";
  if (c.skipForNow.some((m) => t.includes(m.toLowerCase()))) return "Skip For Now";
  if (c.goodToKnow.some((m) => t.includes(m.toLowerCase()))) return "Good To Know";
  // default for fresher-level fundamentals
  return "Good To Know";
}
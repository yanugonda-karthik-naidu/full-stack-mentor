export type RoadmapDay = {
  day: number;
  module: string;
  topic: string;
  subtopics: string[];
  videoQuery: string;
  practice: string[];
  assignment: string;
  interviewQuestions: string[];
  duration: string;
  outcome: string;
};

// 120-day roadmap. Modules cycle through the full Java Full Stack track.
// Content is intentionally compact but covers every day so the dashboard
// can drive the student end-to-end.

const modules: Array<{ name: string; topics: Array<[string, string[]]> }> = [
  {
    name: "Java Foundations",
    topics: [
      ["Setup JDK, IntelliJ, Hello World", ["JDK vs JRE vs JVM", "Run HelloWorld", "main method"]],
      ["Variables & Data Types", ["int, double, char, boolean", "String", "Type casting"]],
      ["Operators", ["Arithmetic", "Relational", "Logical"]],
      ["Conditionals", ["if/else", "switch", "ternary"]],
      ["Loops", ["for", "while", "do-while"]],
      ["Methods", ["Parameters", "Return values", "Overloading"]],
      ["Arrays", ["1D arrays", "2D arrays", "Array iteration"]],
      ["Strings", ["String methods", "StringBuilder", "Immutability"]],
      ["Practice Day", ["Solve 10 problems", "Patterns", "Number programs"]],
      ["Mini Project", ["Calculator CLI", "Number Guess Game", "Refactor methods"]],
    ],
  },
  {
    name: "Object-Oriented Programming",
    topics: [
      ["Classes & Objects", ["Fields", "Methods", "Constructors"]],
      ["Encapsulation", ["private fields", "getters/setters", "this keyword"]],
      ["Inheritance", ["extends", "super", "method overriding"]],
      ["Polymorphism", ["Compile-time", "Run-time", "Dynamic dispatch"]],
      ["Abstraction", ["abstract classes", "interfaces", "default methods"]],
      ["static & final", ["static fields", "static methods", "final"]],
      ["Packages & Access Modifiers", ["public/private/protected", "Import", "Project structure"]],
      ["Inner classes & Anonymous classes", ["Nested", "Local", "Anonymous"]],
      ["OOP Mini Project", ["Bank account system", "Library system", "Apply 4 pillars"]],
      ["OOP Recap & Interview Qs", ["Composition vs Inheritance", "Interface vs Abstract", "SOLID intro"]],
    ],
  },
  {
    name: "Exceptions, Collections & Generics",
    topics: [
      ["Exception Handling", ["try/catch/finally", "throw vs throws", "Custom exceptions"]],
      ["Wrapper classes & Autoboxing", ["Integer/Double", "valueOf", "parseInt"]],
      ["ArrayList & LinkedList", ["add/remove/get", "Iteration", "When to use which"]],
      ["HashMap & HashSet", ["Key-value pairs", "Uniqueness", "Hashing basics"]],
      ["TreeMap & TreeSet", ["Sorted order", "Comparable", "Comparator"]],
      ["Generics", ["Type parameters", "Bounded types", "Wildcards"]],
      ["Streams & Lambdas (intro)", ["Lambda syntax", "map/filter/reduce", "forEach"]],
      ["File I/O", ["FileReader/FileWriter", "BufferedReader", "Try-with-resources"]],
      ["Collections Practice", ["Frequency counter", "Group by", "Top-k problems"]],
      ["Mini Project", ["Contact Book", "Word counter", "Use HashMap"]],
    ],
  },
  {
    name: "SQL & MySQL",
    topics: [
      ["Install MySQL & Workbench", ["CREATE DATABASE", "Tables", "DataTypes"]],
      ["SELECT basics", ["WHERE", "ORDER BY", "LIMIT"]],
      ["INSERT/UPDATE/DELETE", ["Transactions intro", "ROLLBACK", "COMMIT"]],
      ["JOINS", ["INNER", "LEFT", "RIGHT", "FULL"]],
      ["Aggregations", ["GROUP BY", "HAVING", "COUNT/SUM/AVG"]],
      ["Subqueries", ["Scalar", "Correlated", "EXISTS"]],
      ["Indexes & Keys", ["Primary", "Foreign", "Unique", "Index"]],
      ["Normalization", ["1NF", "2NF", "3NF"]],
      ["SQL Practice", ["20 query problems", "HackerRank SQL", "LeetCode SQL easy"]],
      ["SQL Mini Project", ["Design Library schema", "Write queries", "ER diagram"]],
    ],
  },
  {
    name: "HTML, CSS & JavaScript",
    topics: [
      ["HTML basics", ["Tags", "Forms", "Semantic HTML"]],
      ["CSS basics", ["Selectors", "Box model", "Colors & fonts"]],
      ["Flexbox", ["Container vs item", "justify-content", "align-items"]],
      ["Grid", ["Grid template", "Areas", "Responsive grid"]],
      ["Responsive Design", ["Media queries", "Mobile-first", "rem/em"]],
      ["JavaScript basics", ["let/const", "Functions", "Arrays/Objects"]],
      ["DOM Manipulation", ["querySelector", "Events", "innerText"]],
      ["ES6+", ["Arrow functions", "Destructuring", "Spread/rest"]],
      ["Fetch & Promises", ["fetch API", "async/await", "Error handling"]],
      ["Mini Project", ["Portfolio page", "ToDo app (vanilla JS)", "Weather app"]],
    ],
  },
  {
    name: "Spring Boot & REST APIs",
    topics: [
      ["Spring Boot setup", ["start.spring.io", "Project structure", "Run first app"]],
      ["REST Controllers", ["@RestController", "@GetMapping", "@RequestMapping"]],
      ["Request handling", ["@PathVariable", "@RequestParam", "@RequestBody"]],
      ["Service & Repository layers", ["Layered architecture", "Beans", "@Service"]],
      ["Spring Data JPA", ["Entities", "Repositories", "CRUD"]],
      ["DTOs & Validation", ["@Valid", "DTO mapping", "Bean validation"]],
      ["Exception handling", ["@ControllerAdvice", "@ExceptionHandler", "Error response"]],
      ["Testing with Postman", ["GET/POST/PUT/DELETE", "Collections", "Environments"]],
      ["Spring Boot Mini API", ["Student CRUD API", "Connect MySQL", "Test in Postman"]],
      ["Recap & Interview Qs", ["IoC & DI", "Bean lifecycle", "Spring vs Spring Boot"]],
    ],
  },
  {
    name: "Full Stack Integration",
    topics: [
      ["Connect frontend to backend", ["CORS", "fetch to Spring API", "Render JSON"]],
      ["Auth basics", ["Login form", "Session vs JWT (intro)", "Password hashing"]],
      ["JWT in Spring Boot", ["Generate token", "Validate filter", "Secure endpoints"]],
      ["File uploads", ["multipart/form-data", "Save to disk", "Serve files"]],
      ["Pagination & Sorting", ["Pageable", "Sort", "Frontend pagination"]],
      ["MongoDB basics", ["Documents vs rows", "CRUD with Mongo", "When to use"]],
      ["Git & GitHub", ["init/clone", "branch/merge", "Pull requests"]],
      ["Deployment basics", ["Build jar", "Render/Railway", "Env variables"]],
      ["Project Day", ["Pick capstone", "Plan modules", "Set deadlines"]],
      ["Full Stack Recap", ["Architecture diagram", "Common bugs", "Best practices"]],
    ],
  },
  {
    name: "Capstone Project",
    topics: [
      ["Project Setup", ["Repo init", "Folder structure", "README"]],
      ["Database Design", ["ER diagram", "Tables", "Relationships"]],
      ["Backend: Entities & Repos", ["JPA entities", "Repos", "Migrations"]],
      ["Backend: Services", ["Business logic", "Validation", "Error handling"]],
      ["Backend: REST APIs", ["Endpoints", "DTOs", "Postman test"]],
      ["Frontend: Layout", ["Pages", "Navigation", "Components"]],
      ["Frontend: Forms", ["Validation", "Submit handlers", "Error display"]],
      ["Frontend: API integration", ["fetch", "loading states", "error states"]],
      ["Auth & Authorization", ["Login/Signup", "JWT", "Protected routes"]],
      ["Deploy & Demo", ["Deploy backend", "Deploy frontend", "Record demo"]],
    ],
  },
  {
    name: "Interview Preparation",
    topics: [
      ["Core Java MCQs", ["100 MCQs", "Output prediction", "Trick questions"]],
      ["OOP Interviews", ["Pillars", "Real world examples", "Scenario qs"]],
      ["Collections Interviews", ["HashMap internals", "ArrayList vs LinkedList", "Concurrent collections"]],
      ["SQL Interviews", ["JOIN questions", "Nth highest salary", "Window functions intro"]],
      ["Spring Boot Interviews", ["Annotations", "IoC", "JPA"]],
      ["DSA Patterns", ["Arrays", "Strings", "HashMap problems"]],
      ["DSA Patterns", ["Two pointers", "Sliding window", "Recursion intro"]],
      ["System Design (fresher)", ["URL shortener", "Library system", "REST design"]],
      ["Mock Interview Day", ["1 technical mock", "1 HR mock", "Write feedback"]],
      ["Mock Interview Day", ["Project deep dive", "Behavioral", "STAR format"]],
    ],
  },
  {
    name: "Resume, LinkedIn & Placement",
    topics: [
      ["Resume v1", ["ATS template", "Skills section", "Project bullets"]],
      ["Resume v2", ["Quantify achievements", "Action verbs", "Review"]],
      ["LinkedIn profile", ["Headline", "About", "Skills"]],
      ["LinkedIn networking", ["Connection notes", "Engage on posts", "Referral DM"]],
      ["GitHub polish", ["Pinned repos", "READMEs", "Commit graph"]],
      ["Job search routine", ["Daily targets", "Naukri/LinkedIn", "Track in sheet"]],
      ["Application Day", ["Apply to 20 jobs", "Customize resume", "Follow up"]],
      ["Referral Day", ["Identify 10 employees", "Send messages", "Track replies"]],
      ["Mock HR Round", ["Tell me about yourself", "Strengths/weaknesses", "Why this company"]],
      ["Placement Recap", ["Pipeline review", "Goals next month", "Celebrate progress"]],
    ],
  },
  {
    name: "Polish & Job Ready",
    topics: [
      ["Project polish", ["Bug bash", "UI cleanup", "Performance"]],
      ["Add tests", ["JUnit basics", "MockMvc", "Frontend unit"]],
      ["Dockerize app (optional)", ["Dockerfile", "docker-compose", "Run locally"]],
      ["CI/CD basics", ["GitHub Actions", "Build on push", "Auto deploy"]],
      ["Second project sprint", ["Plan", "Scaffold", "Build"]],
      ["Second project sprint", ["Integrate", "Deploy", "Document"]],
      ["Coding round practice", ["1 LeetCode easy", "1 medium", "Time yourself"]],
      ["Coding round practice", ["Pattern revision", "Re-solve favs", "Explain aloud"]],
      ["Interview blitz", ["3 mock interviews", "Record yourself", "Improve"]],
      ["Job-ready Day 120", ["Final resume", "Final portfolio", "Apply 50 jobs"]],
    ],
  },
  {
    name: "Bonus Sprint",
    topics: [
      ["Microservices intro", ["Monolith vs micro", "Eureka", "Feign"]],
      ["Spring Security deep", ["Filters", "Roles", "OAuth2 intro"]],
      ["Caching", ["@Cacheable", "Redis intro", "When to cache"]],
      ["MongoDB deeper", ["Aggregations", "Indexing", "When over MySQL"]],
      ["Testing deeper", ["Integration tests", "Testcontainers intro", "Coverage"]],
      ["Cloud basics", ["AWS EC2/S3 intro", "Render free tier", "Env vars"]],
      ["Soft skills", ["Communication", "Email writing", "Meeting etiquette"]],
      ["Open source intro", ["Find an issue", "Fork & PR", "Read CONTRIBUTING"]],
      ["Continuous learning plan", ["Roadmap for year 1", "Weekly review", "Tech blogs"]],
      ["Graduation", ["Reflect on journey", "Share story", "Mentor someone"]],
    ],
  },
];

const ROADMAP: RoadmapDay[] = [];
let dayCounter = 1;
for (const mod of modules) {
  for (const [topic, subs] of mod.topics) {
    ROADMAP.push({
      day: dayCounter,
      module: mod.name,
      topic,
      subtopics: subs,
      videoQuery: `${topic} Java tutorial for beginners`,
      practice: [
        `Solve 5 short problems on: ${topic}`,
        `Re-explain ${topic} in your own words`,
      ],
      assignment: `Write notes + 1 small example program for: ${topic}`,
      interviewQuestions: [
        `Explain ${topic} like I'm a fresher`,
        `Give a real-world use case for ${topic}`,
        `Common mistakes when using ${topic}?`,
      ],
      duration: "3–5 hours",
      outcome: `Confident with: ${subs.join(", ")}`,
    });
    dayCounter++;
  }
}

export const ROADMAP_DAYS: RoadmapDay[] = ROADMAP;

export const MODULES = Array.from(new Set(ROADMAP.map((d) => d.module)));

export function getDay(day: number): RoadmapDay {
  return ROADMAP[Math.min(ROADMAP.length, Math.max(1, day)) - 1];
}

export function moduleDays(name: string): RoadmapDay[] {
  return ROADMAP.filter((d) => d.module === name);
}
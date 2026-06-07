export type InterviewQuestion = {
  id: string;
  category: "Java" | "OOP" | "Collections" | "SQL" | "Spring Boot" | "Frontend" | "HR";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  answer: string;
};

export const INTERVIEW_BANK: InterviewQuestion[] = [
  {
    id: "j1",
    category: "Java",
    difficulty: "Easy",
    question: "What is the difference between JDK, JRE and JVM?",
    answer:
      "JVM runs Java bytecode. JRE = JVM + libraries needed to RUN Java apps. JDK = JRE + tools (compiler `javac`, debugger) needed to DEVELOP Java apps.",
  },
  {
    id: "j2",
    category: "Java",
    difficulty: "Easy",
    question: "Why is Java called platform independent?",
    answer:
      "Java source compiles to bytecode (.class). The JVM on any OS runs that bytecode, so write once, run anywhere.",
  },
  {
    id: "o1",
    category: "OOP",
    difficulty: "Easy",
    question: "What are the 4 pillars of OOP?",
    answer:
      "Encapsulation (hide data), Inheritance (reuse), Polymorphism (one name, many forms), Abstraction (hide details, show behavior).",
  },
  {
    id: "o2",
    category: "OOP",
    difficulty: "Medium",
    question: "Interface vs Abstract class?",
    answer:
      "Interface: pure contract, multiple inheritance, methods are public abstract (default methods possible). Abstract class: can have state, constructors, partial implementation, single inheritance.",
  },
  {
    id: "c1",
    category: "Collections",
    difficulty: "Easy",
    question: "ArrayList vs LinkedList?",
    answer:
      "ArrayList = dynamic array, O(1) random access, O(n) middle insert. LinkedList = doubly linked, O(1) insert/remove at ends, O(n) random access. Use ArrayList by default.",
  },
  {
    id: "c2",
    category: "Collections",
    difficulty: "Medium",
    question: "How does HashMap work internally?",
    answer:
      "Array of buckets. key.hashCode() → bucket index. Collisions stored as linked list (treeified to a red-black tree past a threshold in Java 8+). Lookup is average O(1).",
  },
  {
    id: "s1",
    category: "SQL",
    difficulty: "Easy",
    question: "INNER JOIN vs LEFT JOIN?",
    answer:
      "INNER JOIN keeps only matching rows from both tables. LEFT JOIN keeps all rows from the left table; non-matching right side is NULL.",
  },
  {
    id: "s2",
    category: "SQL",
    difficulty: "Medium",
    question: "Find the 2nd highest salary.",
    answer:
      "`SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);` or use DENSE_RANK() OVER (ORDER BY salary DESC).",
  },
  {
    id: "sb1",
    category: "Spring Boot",
    difficulty: "Easy",
    question: "What does @SpringBootApplication do?",
    answer:
      "It is a meta-annotation combining @Configuration, @EnableAutoConfiguration, and @ComponentScan — it bootstraps the app and scans your package for components.",
  },
  {
    id: "sb2",
    category: "Spring Boot",
    difficulty: "Medium",
    question: "What is dependency injection?",
    answer:
      "Instead of `new`ing objects yourself, Spring's IoC container creates and injects them. Promotes loose coupling and testability. Use @Autowired or constructor injection (preferred).",
  },
  {
    id: "f1",
    category: "Frontend",
    difficulty: "Easy",
    question: "let vs const vs var?",
    answer:
      "var = function-scoped, hoisted. let = block-scoped, can reassign. const = block-scoped, cannot reassign (object contents still mutable). Default to const, use let when you must reassign.",
  },
  {
    id: "f2",
    category: "Frontend",
    difficulty: "Medium",
    question: "Explain async/await.",
    answer:
      "Syntactic sugar over Promises. `await` pauses an async function until the promise resolves, making async code read top-to-bottom. Wrap in try/catch to handle errors.",
  },
  {
    id: "h1",
    category: "HR",
    difficulty: "Easy",
    question: "Tell me about yourself.",
    answer:
      "30-second pitch: background → skills → recent projects → why this role. Tailor the last sentence to the company. End with enthusiasm.",
  },
  {
    id: "h2",
    category: "HR",
    difficulty: "Easy",
    question: "Why should we hire you?",
    answer:
      "Match 2-3 of their JD bullets to your skills/projects. Show eagerness to learn. Close with a clear value statement.",
  },
];

export const INTERVIEW_CATEGORIES = Array.from(
  new Set(INTERVIEW_BANK.map((q) => q.category)),
);
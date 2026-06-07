export type ProjectSpec = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  stack: string[];
  overview: string;
  requirements: string[];
  folderStructure: string;
  database: string[];
  apis: string[];
  frontend: string[];
  backend: string[];
  steps: string[];
  commonErrors: string[];
  deployment: string[];
  interviewQuestions: string[];
};

export const PROJECTS: ProjectSpec[] = [
  {
    id: "portfolio",
    title: "Portfolio Website",
    level: "Beginner",
    stack: ["HTML", "CSS", "JavaScript"],
    overview: "A personal portfolio that showcases your skills, projects, and contact info.",
    requirements: ["Hero section", "About", "Skills", "Projects", "Contact form"],
    folderStructure: "/index.html\n/styles.css\n/script.js\n/assets/",
    database: ["No DB required"],
    apis: ["Optional: form submission via Formspree"],
    frontend: ["Responsive layout", "Smooth scroll", "Project cards"],
    backend: ["None"],
    steps: [
      "Sketch wireframe on paper",
      "Build HTML structure",
      "Style with CSS (flex/grid)",
      "Add hover and scroll interactions",
      "Deploy to GitHub Pages",
    ],
    commonErrors: ["Forgetting viewport meta", "Hardcoded widths breaking mobile"],
    deployment: ["GitHub Pages", "Netlify drag-and-drop"],
    interviewQuestions: [
      "Walk me through your portfolio architecture",
      "How is it responsive?",
      "Why these projects?",
    ],
  },
  {
    id: "todo",
    title: "ToDo App",
    level: "Beginner",
    stack: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    overview: "A classic ToDo app with add, complete, delete, and persistence.",
    requirements: ["Add task", "Mark complete", "Delete", "Persist on reload"],
    folderStructure: "/index.html\n/styles.css\n/app.js",
    database: ["LocalStorage"],
    apis: ["None"],
    frontend: ["List rendering", "Event delegation", "LocalStorage sync"],
    backend: ["None"],
    steps: [
      "Create input + button",
      "Render list from array",
      "Wire up add/delete/toggle",
      "Save & load from localStorage",
      "Polish UI",
    ],
    commonErrors: ["Mutating state without re-render", "Forgetting JSON.parse on load"],
    deployment: ["GitHub Pages"],
    interviewQuestions: ["How do you persist data?", "How would you sync across devices?"],
  },
  {
    id: "weather",
    title: "Weather App",
    level: "Beginner",
    stack: ["HTML", "CSS", "JavaScript", "OpenWeather API"],
    overview: "Search any city and show current weather using a public API.",
    requirements: ["City search", "Show temp/humidity/icon", "Error handling"],
    folderStructure: "/index.html\n/styles.css\n/app.js",
    database: ["None"],
    apis: ["OpenWeather /weather endpoint"],
    frontend: ["Search form", "Result card", "Loading state"],
    backend: ["None"],
    steps: [
      "Get API key",
      "Build search form",
      "Call API with fetch",
      "Render weather card",
      "Handle errors and loading",
    ],
    commonErrors: ["Exposing API key in public repo (use env on serverless later)"],
    deployment: ["Netlify"],
    interviewQuestions: ["What is async/await?", "How do you handle API failures?"],
  },
  {
    id: "student-mgmt",
    title: "Student Management System",
    level: "Intermediate",
    stack: ["Spring Boot", "MySQL", "JPA", "HTML/CSS/JS"],
    overview: "Full CRUD for students with REST API + simple frontend.",
    requirements: ["List/Add/Edit/Delete students", "Search by name", "Validation"],
    folderStructure: "/backend (Spring Boot)\n/frontend (HTML/JS)\nREADME.md",
    database: ["students(id, name, email, course, year)"],
    apis: [
      "GET /students",
      "POST /students",
      "PUT /students/{id}",
      "DELETE /students/{id}",
    ],
    frontend: ["Table view", "Form modal", "Fetch + render"],
    backend: ["Entity", "Repository (JpaRepository)", "Service", "Controller"],
    steps: [
      "Spring Boot init",
      "Define Student entity",
      "Build CRUD repository + service",
      "Expose REST endpoints",
      "Build frontend table + form",
      "Wire fetch calls",
    ],
    commonErrors: [
      "CORS errors → add @CrossOrigin",
      "Lazy loading exceptions → use DTOs",
    ],
    deployment: ["Render (backend) + Netlify (frontend)"],
    interviewQuestions: [
      "What is @SpringBootApplication?",
      "How does JpaRepository work?",
      "What is CORS and how did you solve it?",
    ],
  },
  {
    id: "employee-mgmt",
    title: "Employee Management System",
    level: "Intermediate",
    stack: ["Spring Boot", "MySQL", "JPA", "React (optional)"],
    overview: "Manage employees, departments, and salaries with REST API.",
    requirements: ["Departments", "Employees", "Salary slips", "Filter by dept"],
    folderStructure: "/backend\n/frontend",
    database: ["departments", "employees", "salaries"],
    apis: ["/departments", "/employees", "/employees/{id}/salary"],
    frontend: ["Dashboard cards", "Tables", "Filters"],
    backend: ["Multiple entities w/ relationships (@OneToMany)"],
    steps: [
      "Design ER diagram",
      "Create entities with relationships",
      "Build services + APIs",
      "Frontend dashboard",
      "Deploy",
    ],
    commonErrors: ["Bidirectional JSON infinite loop → @JsonManagedReference"],
    deployment: ["Render + Vercel"],
    interviewQuestions: ["Explain @OneToMany", "Eager vs Lazy loading"],
  },
  {
    id: "job-portal",
    title: "Job Portal",
    level: "Advanced",
    stack: ["Spring Boot", "MySQL", "JWT", "React"],
    overview: "Job seekers and recruiters can register, post jobs, and apply.",
    requirements: ["Auth (JWT)", "Roles", "Post job", "Apply", "Dashboard"],
    folderStructure: "/backend\n/frontend",
    database: ["users", "jobs", "applications"],
    apis: ["/auth/login", "/auth/signup", "/jobs", "/applications"],
    frontend: ["Login/Signup", "Job feed", "Application tracker"],
    backend: ["Spring Security + JWT", "Role-based access"],
    steps: [
      "Plan modules",
      "Build auth + roles",
      "Job CRUD",
      "Application flow",
      "Recruiter dashboard",
      "Deploy",
    ],
    commonErrors: ["JWT expired bugs", "Role check missing on endpoint"],
    deployment: ["Render + Vercel"],
    interviewQuestions: ["How did you secure endpoints?", "JWT vs Session"],
  },
  {
    id: "college-mgmt",
    title: "College Management System",
    level: "Advanced",
    stack: ["Spring Boot", "MySQL", "Thymeleaf or React"],
    overview: "Manage courses, students, faculty, attendance and grades.",
    requirements: ["Roles", "Attendance", "Grades", "Reports"],
    folderStructure: "/backend\n/frontend",
    database: ["users", "courses", "attendance", "grades"],
    apis: ["/courses", "/attendance", "/grades", "/reports"],
    frontend: ["Role dashboards", "Forms", "Reports"],
    backend: ["Scheduled tasks", "PDF export (optional)"],
    steps: ["Roles", "Course CRUD", "Attendance", "Grades", "Reports"],
    commonErrors: ["N+1 query problems → fetch joins"],
    deployment: ["Render"],
    interviewQuestions: ["How did you handle roles?", "Explain N+1 problem"],
  },
  {
    id: "hospital-mgmt",
    title: "Hospital Management System",
    level: "Advanced",
    stack: ["Spring Boot", "MySQL", "React"],
    overview: "Patients, doctors, appointments, prescriptions, billing.",
    requirements: ["Appointments", "Prescriptions", "Billing", "Reports"],
    folderStructure: "/backend\n/frontend",
    database: ["patients", "doctors", "appointments", "prescriptions", "bills"],
    apis: ["/patients", "/appointments", "/prescriptions", "/bills"],
    frontend: ["Patient & doctor dashboards", "Calendar", "Bill PDF"],
    backend: ["Validation", "Scheduling conflicts"],
    steps: ["Schema", "Auth", "Modules one by one", "Bill PDF", "Deploy"],
    commonErrors: ["Overlapping appointments", "Time zone bugs"],
    deployment: ["Render + Vercel"],
    interviewQuestions: ["How do you prevent double-booking?", "PDF generation approach"],
  },
];

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
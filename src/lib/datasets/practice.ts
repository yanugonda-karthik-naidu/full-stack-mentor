// Topic-wise practice bank. Designed to later be swapped for a JSON
// dataset (practice_dataset.json) without changing call sites.

export type TopicPractice = {
  easy: string[];
  medium: string[];
  hard?: string[];
  platforms: string[];
};

const PRACTICE: Record<string, TopicPractice> = {
  Arrays: {
    easy: ["Find largest element", "Find smallest element", "Sum of array"],
    medium: ["Reverse array in place", "Second largest element", "Move zeros to end"],
    hard: ["Frequency count using HashMap", "Kadane's algorithm"],
    platforms: ["HackerRank → Arrays - DS", "LeetCode → #1 Two Sum", "LeetCode → #485 Max Consecutive Ones"],
  },
  Strings: {
    easy: ["Reverse a string", "Check palindrome", "Count vowels"],
    medium: ["Check anagram", "First non-repeating character", "String compression"],
    platforms: ["HackerRank → Strings", "LeetCode → #344 Reverse String", "LeetCode → #242 Valid Anagram"],
  },
  Loops: {
    easy: ["Print 1 to N", "Sum of first N numbers", "Multiplication table"],
    medium: ["Star pattern pyramid", "Prime numbers up to N", "Fibonacci series"],
    platforms: ["HackerRank → For Loop", "HackerRank → Java Loops I"],
  },
  Conditionals: {
    easy: ["Largest of 3 numbers", "Even or odd", "Leap year check"],
    medium: ["Grade calculator", "Simple calculator using switch"],
    platforms: ["HackerRank → Java If-Else"],
  },
  OOP: {
    easy: ["Create a Student class", "Bank account with deposit/withdraw"],
    medium: ["Library system using inheritance", "Shape hierarchy with polymorphism"],
    platforms: ["HackerRank → Java OOP", "GFG → OOPs in Java practice"],
  },
  Collections: {
    easy: ["Add elements to ArrayList", "Iterate HashMap"],
    medium: ["Word frequency counter using HashMap", "Sort list of students by marks"],
    platforms: ["HackerRank → Java HashMap", "LeetCode → #1 Two Sum (HashMap approach)"],
  },
  SQL: {
    easy: ["SELECT all employees", "Find employees in IT dept", "ORDER BY salary"],
    medium: ["INNER JOIN orders & customers", "GROUP BY department COUNT(*)", "2nd highest salary"],
    platforms: ["HackerRank → SQL (Basic Select)", "LeetCode → #176 Second Highest Salary"],
  },
  HTML: {
    easy: ["Build a profile page", "Build a sign-up form"],
    medium: ["Semantic blog layout", "Accessible navigation bar"],
    platforms: ["MDN HTML exercises", "Frontend Mentor → free challenges"],
  },
  CSS: {
    easy: ["Center a div", "Build a card with shadow"],
    medium: ["Responsive 3-column layout with flex/grid"],
    platforms: ["Flexbox Froggy", "Grid Garden", "Frontend Mentor"],
  },
  JavaScript: {
    easy: ["Click counter", "Toggle dark mode"],
    medium: ["ToDo app with localStorage", "Fetch + render API data"],
    platforms: ["LeetCode → JavaScript 30 Days", "JavaScript30 by Wes Bos"],
  },
  "Spring Boot": {
    easy: ["Hello World REST endpoint", "GET /students returning a list"],
    medium: ["Full CRUD for Student entity with JPA + MySQL"],
    platforms: ["Spring Boot guides → spring.io/guides"],
  },
};

export function practiceForTopic(topic: string): TopicPractice | null {
  const t = topic.toLowerCase();
  const key = Object.keys(PRACTICE).find((k) => t.includes(k.toLowerCase()));
  return key ? PRACTICE[key] : null;
}

export const PRACTICE_BANK = PRACTICE;
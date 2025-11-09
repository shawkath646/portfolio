export interface Repository {
  id: string;
  name: string;
  displayName: string;
  description: string;
  githubUrl: string;
  category: "main" | "android" | "web-course" | "nextjs-project";
  technologies: string[];
  featured: boolean;
  order: number;
}

export const repositories: Repository[] = [
  {
    id: "portfolio",
    name: "@shawkath646/portfolio",
    displayName: "Personal Portfolio",
    description: "Main personal portfolio website created with Next.js. Features modern UI/UX, admin panel, gallery system, and comprehensive SEO optimization.",
    githubUrl: "https://github.com/shawkath646/portfolio",
    category: "main",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase"],
    featured: true,
    order: 1
  },
  {
    id: "portfolio-client-app",
    name: "@shawkath646/portfolio-client-app",
    displayName: "Portfolio Android App",
    description: "Native Android application for the personal portfolio, providing mobile access to portfolio content and features.",
    githubUrl: "https://github.com/shawkath646/portfolio-client-app",
    category: "android",
    technologies: ["Android", "Kotlin", "Firebase"],
    featured: true,
    order: 2
  },
  {
    id: "club-template",
    name: "@shawkath646/club-template",
    displayName: "Science Club Management",
    description: "A comprehensive Next.js project for managing science club activities, members, and events.",
    githubUrl: "https://github.com/shawkath646/club-template",
    category: "nextjs-project",
    technologies: ["Next.js", "React", "TypeScript"],
    featured: true,
    order: 3
  },
  {
    id: "hi-mart-frontend",
    name: "@shawkath646/hi-mart-frontend",
    displayName: "Hi-Mart Frontend",
    description: "Frontend application for the Hi-Mart e-commerce platform, developed as part of web programming course project.",
    githubUrl: "https://github.com/shawkath646/hi-mart-frontend",
    category: "web-course",
    technologies: ["React", "JavaScript", "CSS"],
    featured: false,
    order: 4
  },
  {
    id: "hi-mart-backend",
    name: "@shawkath646/hi-mart-backend",
    displayName: "Hi-Mart Backend",
    description: "Backend server for the Hi-Mart e-commerce platform, providing RESTful APIs and database management.",
    githubUrl: "https://github.com/shawkath646/hi-mart-backend",
    category: "web-course",
    technologies: ["Node.js", "Express", "MongoDB"],
    featured: false,
    order: 5
  },
  {
    id: "portfolio-assignment-01",
    name: "@shawkath646/portfolio-assignment-01",
    displayName: "Web Programming Assignment",
    description: "Assignment project for web programming course demonstrating fundamental web development concepts.",
    githubUrl: "https://github.com/shawkath646/portfolio-assignment-01",
    category: "web-course",
    technologies: ["HTML", "CSS", "JavaScript"],
    featured: false,
    order: 6
  },
  {
    id: "web-midterm-project",
    name: "@shawkath646/web-midterm-project",
    displayName: "Web Programming Midterm",
    description: "Midterm project for web programming course showcasing intermediate web development skills.",
    githubUrl: "https://github.com/shawkath646/web-midterm-project",
    category: "web-course",
    technologies: ["HTML", "CSS", "JavaScript"],
    featured: false,
    order: 7
  }
];

// Helper functions to filter and sort repositories
export const getFeaturedRepositories = (): Repository[] => {
  return repositories.filter(repo => repo.featured).sort((a, b) => a.order - b.order);
};

export const getRepositoriesByCategory = (category: Repository["category"]): Repository[] => {
  return repositories.filter(repo => repo.category === category).sort((a, b) => a.order - b.order);
};

export const getAllRepositories = (): Repository[] => {
  return repositories.sort((a, b) => a.order - b.order);
};

export const getRepositoryById = (id: string): Repository | undefined => {
  return repositories.find(repo => repo.id === id);
};

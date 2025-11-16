"use server";

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    topics: string[];
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    archived: boolean;
    visibility: string;
}

interface CategorizedProject {
    id: number;
    name: string;
    fullName: string;
    description: string | null;
    url: string;
    homepage: string | null;
    topics: string[];
    stars: number;
    forks: number;
    language: string | null;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    archived: boolean;
}

interface CategorizedProjects {
    Personal: CategorizedProject[];
    Assignments: CategorizedProject[];
    Voluntary: CategorizedProject[];
    "Client Work": CategorizedProject[];
    "Public Release": CategorizedProject[];
    Uncategorized: CategorizedProject[];
}

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "shawkath646";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const categories = ["Personal", "Assignments", "Voluntary", "Client Work", "Public Release"] as const;

export async function getProjectsData(): Promise<CategorizedProjects> {
    try {
        const headers: HeadersInit = {
            "Accept": "application/vnd.github.v3+json",
        };

        // Add token if available for higher rate limits
        if (GITHUB_TOKEN) {
            headers["Authorization"] = `token ${GITHUB_TOKEN}`;
        }

        // Fetch all repositories (including pagination)
        const allRepos: GitHubRepo[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
                {
                    headers,
                    next: { revalidate: 3600 }, // Cache for 1 hour
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const repos: GitHubRepo[] = await response.json();

            if (repos.length === 0) {
                hasMore = false;
            } else {
                allRepos.push(...repos);
                page++;
            }

            // Safety check: limit to 10 pages (1000 repos)
            if (page > 10) {
                hasMore = false;
            }
        }

        // Initialize categorized projects
        const categorizedProjects: CategorizedProjects = {
            Personal: [],
            Assignments: [],
            Voluntary: [],
            "Client Work": [],
            "Public Release": [],
            Uncategorized: [],
        };

        // Categorize repositories based on topics
        for (const repo of allRepos) {
            const serializedProject: CategorizedProject = {
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                url: repo.html_url,
                homepage: repo.homepage,
                topics: repo.topics,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                pushedAt: repo.pushed_at,
                archived: repo.archived,
            };

            // Check topics for categorization keywords
            const topicsLower = repo.topics.map(topic => topic.toLowerCase());
            let categorized = false;

            // Check for Personal
            if (topicsLower.some(topic =>
                topic.includes("personal") ||
                topic.includes("portfolio") ||
                topic.includes("own-project")
            )) {
                categorizedProjects.Personal.push(serializedProject);
                categorized = true;
            }
            // Check for Assignments
            else if (topicsLower.some(topic =>
                topic.includes("assignment") ||
                topic.includes("homework") ||
                topic.includes("coursework") ||
                topic.includes("academic")
            )) {
                categorizedProjects.Assignments.push(serializedProject);
                categorized = true;
            }
            // Check for Voluntary
            else if (topicsLower.some(topic =>
                topic.includes("voluntary") ||
                topic.includes("volunteer") ||
                topic.includes("opensource") ||
                topic.includes("open-source") ||
                topic.includes("contribution")
            )) {
                categorizedProjects.Voluntary.push(serializedProject);
                categorized = true;
            }
            // Check for Client Work
            else if (topicsLower.some(topic =>
                topic.includes("client") ||
                topic.includes("client-work") ||
                topic.includes("client-project") ||
                topic.includes("freelance") ||
                topic.includes("commissioned")
            )) {
                categorizedProjects["Client Work"].push(serializedProject);
                categorized = true;
            }
            // Check for Public Release
            else if (topicsLower.some(topic =>
                topic.includes("public-release") ||
                topic.includes("public") ||
                topic.includes("library") ||
                topic.includes("package") ||
                topic.includes("tool") ||
                topic.includes("utility") ||
                topic.includes("framework")
            )) {
                categorizedProjects["Public Release"].push(serializedProject);
                categorized = true;
            }

            // If not categorized, add to Uncategorized
            if (!categorized) {
                categorizedProjects.Uncategorized.push(serializedProject);
            }
        }

        // Sort each category by updated date (most recent first)
        Object.keys(categorizedProjects).forEach((category) => {
            categorizedProjects[category as keyof CategorizedProjects].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        });

        return categorizedProjects;
    } catch (error) {
        console.error("Error fetching GitHub projects:", error);
        throw new Error("Failed to fetch GitHub projects");
    }
}

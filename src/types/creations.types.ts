export interface GitHubRepoResponse {
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

export interface ProjectType {
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
    createdAt: Date;
    updatedAt: Date;
    pushedAt: Date;
    archived: boolean;
    category: string;
    platform: "web" | "android" | "other";
    timeText: string;
}

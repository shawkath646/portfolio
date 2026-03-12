"use server";

import { cache } from "react";
import { GitHubRepoResponse, ProjectType } from "@/types/creations.types";
import { formatRelativeTime } from "@/utils/dateTime";
import { getEnv } from "@/utils/getEnv";

const GITHUB_USERNAME = getEnv("GITHUB_USERNAME");
const GITHUB_TOKEN = getEnv("GITHUB_TOKEN");

type GetProjectsDataParams = {
    page?: number;
    limit?: number;
};

type GitHubUserResponse = {
    public_repos: number;
};

type ProjectsResponse = {
    projects: ProjectType[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
};

function detectCategory(topics: string[]): string {
    const topicsLower = topics.map((t) => t.toLowerCase());

    if (
        topicsLower.some((t) =>
            ["personal", "portfolio", "own-project"].some((k) => t.includes(k))
        )
    )
        return "Personal";

    if (
        topicsLower.some((t) =>
            ["assignment", "homework", "coursework", "academic"].some((k) =>
                t.includes(k)
            )
        )
    )
        return "Assignments";

    if (
        topicsLower.some((t) =>
            ["voluntary", "volunteer", "opensource", "open-source", "contribution"].some(
                (k) => t.includes(k)
            )
        )
    )
        return "Voluntary";

    if (
        topicsLower.some((t) =>
            ["client", "client-work", "client-project", "freelance", "commissioned"].some(
                (k) => t.includes(k)
            )
        )
    )
        return "Client Work";

    if (
        topicsLower.some((t) =>
            [
                "public-release",
                "public",
                "library",
                "package",
                "tool",
                "utility",
                "framework",
            ].some((k) => t.includes(k))
        )
    )
        return "Public Release";

    return "Uncategorized";
};

function detectPlatform(repo: GitHubRepoResponse): ProjectType["platform"] {
    const topicsLower = repo.topics.map(t => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();
    const name = repo.name.toLowerCase();
    const language = repo.language || "";

    if (
        topicsLower.some(t =>
            t.includes("android") ||
            t.includes("mobile") ||
            t.includes("react-native") ||
            t.includes("expo") ||
            t.includes("flutter")
        ) ||
        desc.includes("android") ||
        desc.includes("mobile app") ||
        language === "Kotlin" ||
        (language === "Java" && (desc.includes("app") || name.includes("app")))
    ) {
        return "android";
    }

    if (
        topicsLower.some(t =>
            t.includes("website") ||
            t.includes("web") ||
            t.includes("nextjs") ||
            t.includes("react") ||
            t.includes("vue") ||
            t.includes("frontend") ||
            t.includes("backend") ||
            t.includes("fullstack")
        ) ||
        desc.includes("website") ||
        desc.includes("web app") ||
        desc.includes("web application") ||
        ["TypeScript", "JavaScript", "HTML", "Vue"].includes(language)
    ) {
        return "web";
    }

    return "other";
};

const getProjectsData = cache(async ({
    page = 1,
    limit = 20,
}: GetProjectsDataParams = {}): Promise<ProjectsResponse> => {

    const pageNumber = Math.max(1, page);

    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
        headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    const [reposResponse, userResponse] = await Promise.all([
        fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${limit}&page=${pageNumber}&sort=updated`,
            {
                headers,
                next: { revalidate: 3600 },
            }
        ),
        fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}`,
            {
                headers,
                next: { revalidate: 3600 },
            }
        ),
    ]);

    const repos: GitHubRepoResponse[] = await reposResponse.json();

    let totalItems = (pageNumber - 1) * limit + repos.length;

    if (userResponse.ok) {
        const userData = await userResponse.json() as GitHubUserResponse;

        if (Number.isFinite(userData.public_repos) && userData.public_repos >= 0) {
            totalItems = userData.public_repos;
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    const projects: ProjectType[] = repos.map((repo) => ({
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
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        pushedAt: new Date(repo.pushed_at),
        archived: repo.archived,
        category: detectCategory(repo.topics),
        platform: detectPlatform(repo),
        timeText: formatRelativeTime(repo.updated_at)
    }));

    return {
        projects,
        page: pageNumber,
        limit: limit,
        totalItems,
        totalPages,
        hasMore: pageNumber < totalPages,
    };
});

export default getProjectsData;
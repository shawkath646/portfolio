import type { MetadataRoute } from "next";

const baseUrl = process.env.APP_BASE_URL || "https://shawkath646.pro";

async function getProjectIds(): Promise<string[]> {
    return ["portfolio-site", "weather-app", "ecommerce-platform"];
}

async function getBlogIds(): Promise<string[]> {
    return ["how-i-started", "learning-fullstack", "korean-life-experience"];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjectIds();
    const blogPosts = await getBlogIds();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about/my-stories`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about/my-goals`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about/achievements`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    const dynamicRoutes: MetadataRoute.Sitemap = [
        ...projects.map<MetadataRoute.Sitemap[number]>((id) => ({
            url: `${baseUrl}/projects/${id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        })),
        ...blogPosts.map<MetadataRoute.Sitemap[number]>((id) => ({
            url: `${baseUrl}/blog/${id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
}

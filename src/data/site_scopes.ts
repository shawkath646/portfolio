export interface RouteScope {
    path: string;
    parentPath?: string;
    label?: string;
    description?: string;
}

export const BASE_SITE_SCOPES: RouteScope[] = [
    {
        path: "/about/personal-life",
        label: "Personal Life",
        description: "Access to personal biography and private timeline details",
    },
    {
        path: "/about/friends-corner",
        label: "Friends Corner",
        description: "Access to friends corner memories and stories",
    },
    {
        path: "/about/love-corner",
        label: "Love Corner",
        description: "Access to love corner, timeline, and stories",
    },
];

export const SITE_SCOPES: RouteScope[] = BASE_SITE_SCOPES;

export const ALLOWED_ROUTES = BASE_SITE_SCOPES.map((s) => s.path);

export type AllowedRoute = string;

export function buildDynamicRouteScopes(
    persons: Array<{ slug: string; category?: string; name?: string }>
): RouteScope[] {
    const scopes: RouteScope[] = [...BASE_SITE_SCOPES];
    const seen = new Set(scopes.map((s) => s.path));

    for (const person of persons) {
        if (!person.slug) continue;
        const cleanSlug = person.slug.trim().toLowerCase();

        let parentPath = "/about/love-corner";
        if (person.category === "friends") {
            parentPath = "/about/friends-corner";
        } else if (person.category === "love corner") {
            parentPath = "/about/love-corner";
        }

        const subRoutePath = `${parentPath}/${cleanSlug}`;
        if (!seen.has(subRoutePath)) {
            seen.add(subRoutePath);
            scopes.push({
                path: subRoutePath,
                parentPath,
                label: person.name || cleanSlug,
            });
        }
    }

    return scopes;
}

export function isRouteAllowed(allowedRoutes: string[] | undefined, targetRoute: string): boolean {
    if (!allowedRoutes || !Array.isArray(allowedRoutes) || allowedRoutes.length === 0) {
        return false;
    }

    const normalizedTarget = targetRoute.replace(/\/$/, "");

    // 1. Direct exact match
    if (allowedRoutes.includes(normalizedTarget)) {
        return true;
    }

    // 2. Parent prefix match (e.g. allowed: "/about/love-corner", target: "/about/love-corner/jane")
    const hasParentAllowed = allowedRoutes.some((parent) => {
        const normalizedParent = parent.replace(/\/$/, "");
        return normalizedTarget.startsWith(normalizedParent + "/");
    });
    if (hasParentAllowed) {
        return true;
    }

    // 3. Person alias match (/person/[slug] matching /about/*/[slug])
    if (normalizedTarget.startsWith("/person/")) {
        const slug = normalizedTarget.slice("/person/".length);
        if (allowedRoutes.includes("/person/" + slug)) return true;
        if (allowedRoutes.some((r) => r.endsWith("/" + slug))) return true;
    }

    return false;
}

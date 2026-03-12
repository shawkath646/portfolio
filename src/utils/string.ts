interface SlugOptions {
    prefix?: string;
    includeDate?: boolean;
}

export const generateSlug = (
    str: string,
    options?: SlugOptions
): string => {
    const baseSlug = str
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const parts: string[] = [];

    if (options?.prefix) {
        parts.push(options.prefix);
    }

    if (options?.includeDate) {
        const d = new Date();
        const formattedDate = d
            .toISOString()
            .slice(2, 10)
            .replace(/-/g, "");

        parts.push(formattedDate);
    }

    parts.push(baseSlug);

    return parts.join("-");
};

export const sanitizeStr = (str: string): string =>
    str.replace(/[^a-zA-Z0-9._-]/g, '_');
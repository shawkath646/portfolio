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

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getSingleSearchParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SiteCodeType = "admin-panel" | "personal-life" | "friends-corner" | "love-corner";
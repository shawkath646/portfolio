export type PersonCategory = "friends" | "love corner";
export type GenderType = "male" | "female";

export interface PersonObject {
    id: string;
    name: string;
    slug: string;
    category: PersonCategory;
    gender: GenderType;
    addToTimeline: boolean;
    priority: boolean | null;
    profilePic: string | null;
    mdxUrl: string | null;
    startOn: Date | null;
    endOn: Date | null;
    dob: Date | null;
    phone: string[] | string | null;
    address: string | null;
    info: string | null;
    email?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

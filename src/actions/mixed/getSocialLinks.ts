"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";

export interface SocialLinksType {
    email: string;
    facebook: string;
    github: string;
    instagram: string;
    kakaoTalk: string;
    linkedIn: string;
    messengar: string;
    telegram: string;
    tiktok: string;
    whatsapp: string;
    youtube: string;
}

const getSocialLinks = cache(async () => {
    const docRef = await db.collection("site-config").doc("social").get();
    return docRef.data() as SocialLinksType;
});

export default getSocialLinks;
"use server";

import { getAuthSession } from "@/actions/authentication/authSession";
import { GalleryAlbumType } from "@/types/gallery.types";
import { getAdminAlbumsList as fetchAdminAlbumsList } from "./getGalleryData";

export async function getAdminAlbumsList(): Promise<GalleryAlbumType[]> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        throw new Error("Error: Permission denied! Session not found.");
    }
    return await fetchAdminAlbumsList();
}

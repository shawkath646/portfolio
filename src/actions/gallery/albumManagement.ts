"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { GalleryAlbumType } from "@/types/gallery.types";
import { generateSlug } from "@/utils/string";
import { getAuthSession } from "../authentication/authActions";


export const createAlbum = async (
    albumName: string
): Promise<APIResponseType> => {
    const adminSession = await getAuthSession();

    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const collectionRef = db.collection("gallery-albums");

    const slug = generateSlug(albumName, { prefix: "alb" });

    const existing = await collectionRef
        .where("slug", "==", slug)
        .limit(1)
        .get();

    if (!existing.empty) {
        return {
            success: false,
            message: "Error: An album with this name already exists. Please choose another name."
        };
    }

    const docRef = collectionRef.doc();

    const albumObject: GalleryAlbumType = {
        id: docRef.id,
        name: albumName,
        slug,
        imageCount: 0,
        previewImages: [],
        timestamp: new Date()
    };

    await docRef.create(albumObject);

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return {
        success: true,
        message: "Album successfully created!"
    };
};

export const updateAlbum = async (
    albumId: string,
    newName: string
): Promise<APIResponseType> => {
    const adminSession = await getAuthSession();

    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const nextName = newName.trim();

    if (!nextName) {
        return {
            success: false,
            message: "Error: Album name cannot be empty."
        };
    }

    const docRef = db.collection("gallery-albums").doc(albumId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return {
            success: false,
            message: "Error: Album doesn't exist!"
        };
    }

    const newSlug = generateSlug(nextName, { prefix: "alb" });

    const existingSlug = await db
        .collection("gallery-albums")
        .where("slug", "==", newSlug)
        .limit(1)
        .get();

    if (!existingSlug.empty && existingSlug.docs[0].id !== albumId) {
        return {
            success: false,
            message: "Error: Another album already uses this name."
        };
    }

    await docRef.update({
        name: nextName,
        slug: newSlug
    } as Partial<GalleryAlbumType>);

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return {
        success: true,
        message: "Album updated successfully."
    };
};

export const deleteAlbum = async (
    albumId: string
): Promise<APIResponseType> => {
    const adminSession = await getAuthSession();

    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const albumsRef = db.collection("gallery-albums");
    const imagesRef = db.collection("gallery-images");

    const snapshot = await imagesRef
        .where("albumId", "==", albumId)
        .get();

    if (!snapshot.empty) {
        const docs = snapshot.docs;

        for (let i = 0; i < docs.length; i += 500) {
            const batch = db.batch();
            const chunk = docs.slice(i, i + 500);

            chunk.forEach((doc) => {
                batch.update(doc.ref, {
                    albumId: null,
                });
            });

            await batch.commit();
        }
    }

    await albumsRef.doc(albumId).delete();

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return {
        success: true,
        message: "Album deleted successfully."
    };
};
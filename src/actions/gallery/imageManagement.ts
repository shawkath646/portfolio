"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { bucket, db, FieldValue } from "@/lib/firebase";
import { APIResponseType, PartialBy } from "@/types/common.types";
import { GalleryImageType } from "@/types/gallery.types";
import { generatePublicUrl, generateSignedUploadURL, verifyFileExists } from "@/utils/storage";
import { generateSlug } from "@/utils/string";
import { getAlbumById, getImageById, getImageBySlug } from "./getGalleryData";
import { getAuthSession } from "../authentication/authActions";

const IMAGE_MAX_FILE_SIZE = 10 * 1024 * 1024;

interface RequestImageUploadURLProps {
    fileType: string;
    fileSize: number;
}

interface RequestImageUploadURLResponse extends APIResponseType {
    uploadURL?: string;
    imageId?: string;
}

export async function requestImageUploadURL(
    props: RequestImageUploadURLProps
): Promise<RequestImageUploadURLResponse> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    };

    const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ];

    if (!validTypes.includes(props.fileType)) {
        return { success: false, message: "Error: Invalid file type." };
    }

    if (props.fileSize <= 0 || props.fileSize > IMAGE_MAX_FILE_SIZE) {
        return {
            success: false,
            message: `Error: File must be under ${Math.floor(
                IMAGE_MAX_FILE_SIZE / (1024 * 1024)
            )}MB.`,
        };
    }

    const imageId = crypto.randomUUID();
    const storagePath = `gallery/${imageId}`;

    const uploadURL = await generateSignedUploadURL({
        storagePath,
        contentType: props.fileType,
        maxSizeBytes: props.fileSize,
        expiryMs: 5 * 60 * 1000 // 5 min
    });

    return {
        success: true,
        message: "Upload URL generated.",
        imageId,
        uploadURL,
    };
}

export async function saveGalleryImage(
    props: PartialBy<GalleryImageType, "slug" | "src" | "createdAt">
): Promise<APIResponseType> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    };

    if (!props.albumId) {
        return { success: false, message: "Error: Album ID not provided." };
    }

    const storagePath = `gallery/${props.id}`;

    if (!(await verifyFileExists(storagePath))) {
        return { success: false, message: "Image not uploaded." };
    }

    const imageSlug = generateSlug(props.title, { prefix: "img" });
    const duplicateImage = await getImageBySlug(imageSlug);

    if (duplicateImage !== null) {
        return { success: false, message: "Error: Image with slug already exists!" };
    }

    const album = await getAlbumById(props.albumId);
    if (!album) {
        return { success: false, message: "Invalid album." };
    }

    const publicUrl = await generatePublicUrl(storagePath);

    const imageObject: GalleryImageType = {
        ...props,
        src: publicUrl,
        slug: imageSlug,
        createdAt: new Date(),
    };

    await db
        .collection("gallery-images")
        .doc(imageObject.id)
        .set(imageObject);

    const previewImages = [
        imageObject.id,
        ...(album.previewImages ?? []).filter(id => id !== imageObject.id)
    ].slice(0, 5);

    await db
        .collection("gallery-albums")
        .doc(album.id)
        .update({
            previewImages,
            imageCount: FieldValue.increment(1)
        });


    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return { success: true, message: "Image saved." };
}

export async function deleteImage(
    imageId: string
): Promise<APIResponseType> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    };

    const image = await getImageById(imageId);
    if (!image) {
        return { success: false, message: "Image not found." };
    }

    if (image.albumId) {
        const album = await getAlbumById(image.albumId);
        if (album && album.previewImages.includes(imageId)) {
            await db.collection("gallery-albums")
                .doc(album.id)
                .update({
                    previewImages: FieldValue.arrayRemove(imageId),
                    imageCount: FieldValue.increment(-1)
                });
        }
    }

    const filePath = `gallery/${imageId}`;

    if (await verifyFileExists(filePath)) {
        await bucket.file(filePath).delete().catch(() => { });
    }

    await db.collection("gallery-images").doc(imageId).delete();

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return { success: true, message: "Image deleted successfully." };
}

export async function updateImageAlbum(
    imageId: string,
    newAlbumId: string
): Promise<APIResponseType> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const imageRef = db.collection("gallery-images").doc(imageId);
    const newAlbumRef = db.collection("gallery-albums").doc(newAlbumId);

    await db.runTransaction(async (tx) => {
        const imageDoc = await tx.get(imageRef);

        if (!imageDoc.exists) {
            return { success: false, message: "Error: Image with provided id did\'nt exist!" };
        }

        const imageData = imageDoc.data() as GalleryImageType;
        const oldAlbumId = imageData.albumId;

        if (oldAlbumId) {
            const oldAlbumRef = db.collection("gallery-albums").doc(oldAlbumId);

            tx.update(oldAlbumRef, {
                imageCount: FieldValue.increment(-1)
            });
        }

        tx.update(imageRef, {
            albumId: newAlbumId
        });

        tx.update(newAlbumRef, {
            imageCount: FieldValue.increment(1)
        });
    });

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return {
        success: true,
        message: "Image album updated successfully."
    };
}
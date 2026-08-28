"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { bucket, db, FieldValue } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { GalleryImageType, GalleryImageItemType } from "@/types/gallery.types";
import { generatePublicUrl, generateSignedUploadURL, verifyFileExists } from "@/utils/storage";
import { generateSlug } from "@/utils/string";
import { getAlbumById, getImageBySlug } from "./getGalleryData";
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

async function generateUniqueImageSlug(title: string): Promise<string> {
    const baseSlug = generateSlug(title, { prefix: "img" });
    let candidateSlug = baseSlug;
    let suffix = 2;

    while (await getImageBySlug(candidateSlug)) {
        candidateSlug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    return candidateSlug;
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
    metadata: Omit<GalleryImageType, "id" | "slug" | "images" | "timestamp">,
    images: Omit<GalleryImageItemType, "src">[]
): Promise<APIResponseType> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    if (!metadata.albumId) {
        return { success: false, message: "Error: Album ID not provided." };
    }

    if (!images || images.length === 0) {
        return { success: false, message: "Image sources are missing." };
    }

    const [album, imageSlug, uploadChecks] = await Promise.all([
        getAlbumById(metadata.albumId),
        generateUniqueImageSlug(metadata.title),
        Promise.all(
            images.map(async (img) => {
                const storagePath = `gallery/${img.id}`;
                const exists = await verifyFileExists(storagePath);
                const publicUrl = exists ? await generatePublicUrl(storagePath) : "";

                return { ...img, exists, publicUrl };
            })
        )
    ]);

    if (!album) {
        return { success: false, message: "Invalid album." };
    }

    const failedUploads = uploadChecks.filter((item) => !item.exists);

    if (failedUploads.length > 0) {
        const failedIds = failedUploads.map(img => img.id).join(", ");
        return {
            success: false,
            message: `Operation aborted. The following images failed to upload: ${failedIds}`,
        };
    }

    const batch = db.batch();

    const parentImageRef = db.collection("gallery-images").doc();
    const imageItems: GalleryImageItemType[] = uploadChecks.map((imgCheck) => ({
        id: imgCheck.id,
        src: imgCheck.publicUrl,
        height: imgCheck.height,
        width: imgCheck.width,
        timestamp: imgCheck.timestamp,
        size: imgCheck.size
    }));
    const parentObject: GalleryImageType = {
        ...metadata,
        id: parentImageRef.id,
        slug: imageSlug,
        timestamp: new Date(),
        images: imageItems,
    };
    batch.set(parentImageRef, parentObject);

    const albumRef = db.collection("gallery-albums").doc(album.id);
    const previewImages = [
        parentImageRef.id,
        ...(album.previewImages ?? []).filter((id: string) => id !== parentImageRef.id)
    ].slice(0, 5);

    batch.update(albumRef, {
        previewImages,
        imageCount: FieldValue.increment(1)
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error("Failed to commit batch:", error);
        return { success: false, message: "Database error while saving images." };
    }

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return { success: true, message: "Image saved successfully." };
}

export async function deleteImage(
    imageRecordId: string
): Promise<APIResponseType> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const imageRef = db.collection("gallery-images").doc(imageRecordId);
    const imageDoc = await imageRef.get();

    if (!imageDoc.exists) {
        return { success: false, message: "Image record not found." };
    }
    const image = imageDoc.data() as GalleryImageType;
    const storageImageIds = (image.images ?? []).map((imageItem) => imageItem.id);

    if (image.albumId) {
        const albumRef = db.collection("gallery-albums").doc(image.albumId);
        const albumDoc = await albumRef.get();

        if (albumDoc.exists) {
            await albumRef.update({
                previewImages: FieldValue.arrayRemove(imageRecordId),
                imageCount: FieldValue.increment(-1)
            }).catch(err => console.error("Failed to update album during deletion:", err));
        }
    }

    if (storageImageIds.length > 0) {
        await Promise.all(
            storageImageIds.map(async (storageImageId) => {
                const filePath = `gallery/${storageImageId}`;

                try {
                    const file = bucket.file(filePath);
                    const [exists] = await file.exists();

                    if (exists) {
                        await file.delete();
                    }
                } catch (error) {
                    console.error(`Failed to delete storage file ${filePath}:`, error);
                }
            })
        );
    }

    const batch = db.batch();

    batch.delete(imageRef);

    try {
        await batch.commit();
    } catch (error) {
        console.error("Failed to delete Firestore documents:", error);
        return { success: false, message: "Failed to delete database records." };
    }

    revalidatePath("/about/gallery", "layout");
    revalidatePath("/admin/gallery", "layout");

    return { success: true, message: "Image record and files deleted successfully." };
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


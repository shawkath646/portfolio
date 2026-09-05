"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/actions/authentication/authSession";
import { db, bucket } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { PersonObject, PersonCategory, GenderType } from "@/types/person.types";
import getErrorMessage from "@/utils/getErrorMessage";
import { generateSignedUploadURL, deleteStorageFileByUrl } from "@/utils/storage";
import { generateSlug } from "@/utils/string";

// --- Types ---
interface RequestProfilePicResponse extends APIResponseType {
    uploadURL?: string;
    profilePicUrl?: string;
}

interface SavePersonInput {
    id?: string;
    name: string;
    category: PersonCategory;
    gender: GenderType;
    addToTimeline: boolean;
    priority?: boolean | null;
    profilePic?: string | null;
    mdxUrl?: string | null;
    startOn?: Date | null;
    endOn?: Date | null;
    dob?: Date | null;
    phone?: string[] | null;
    address?: string | null;
    info?: string | null;
    email?: string | null;
}

const PERSONS_COLLECTION = db.collection("persons");

// 1. Request signed URL for uploading profile picture
export async function requestProfilePicUploadURL(
    fileType: string,
    fileSize: number
): Promise<RequestProfilePicResponse> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(fileType)) {
        return { success: false, message: "Error: Invalid file type." };
    }

    if (fileSize > 5 * 1024 * 1024) { // Max size 5MB
        return { success: false, message: "Error: File size exceeds 5MB limit." };
    }

    try {
        const imageId = crypto.randomUUID();
        const storagePath = `profile-pics/${imageId}`;
        
        const uploadURL = await generateSignedUploadURL({
            storagePath,
            contentType: fileType,
            maxSizeBytes: fileSize,
        });

        const profilePicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

        return {
            success: true,
            message: "Upload URL generated successfully",
            uploadURL,
            profilePicUrl,
        };
    } catch (error: unknown) {
        const em = getErrorMessage(error);
        console.error(em);
        return { success: false, message: em || "Failed to generate upload URL." };
    }
}

// 1.5 Request signed URL for uploading MDX files
export async function requestMdxUploadURL(
    fileType: string,
    fileSize: number
): Promise<APIResponseType & { uploadURL?: string; mdxUrl?: string }> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    if (fileSize > 5 * 1024 * 1024) { // Max size 5MB
        return { success: false, message: "Error: File size exceeds 5MB limit." };
    }

    const validMdxTypes = [
        "text/markdown",
        "text/plain",
        "text/mdx",
        "text/x-markdown",
        "application/octet-stream",
    ];

    if (!validMdxTypes.includes(fileType)) {
        return { success: false, message: "Error: Invalid file type. Must be a Markdown (.md / .mdx) file." };
    }

    try {
        const fileId = crypto.randomUUID();
        const storagePath = `persons-mdx/${fileId}.mdx`;

        const uploadURL = await generateSignedUploadURL({
            storagePath,
            contentType: fileType,
            maxSizeBytes: fileSize,
        });

        const mdxUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

        return {
            success: true,
            message: "MDX Upload URL generated successfully",
            uploadURL,
            mdxUrl,
        };
    } catch (error: unknown) {
        const em = getErrorMessage(error);
        console.error(em);
        return { success: false, message: em || "Failed to generate MDX upload URL." };
    }
}

// Helper to make GCS upload public after client upload finishes
async function makeStorageFilePublic(url: string): Promise<void> {
    try {
        const prefix = `https://storage.googleapis.com/${bucket.name}/`;
        if (url.startsWith(prefix)) {
            const storagePath = url.substring(prefix.length);
            const file = bucket.file(storagePath);
            const [exists] = await file.exists();
            if (exists) {
                await file.makePublic();
            }
        }
    } catch (error) {
        console.error("Failed to make file public:", error);
    }
}

// 2. Save / Edit Person Server Action
export async function savePersonAction(
    personData: SavePersonInput
): Promise<APIResponseType & { personId?: string }> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    if (!personData.name?.trim()) {
        return { success: false, message: "Error: Name is required." };
    }

    if (personData.mdxUrl) {
        try {
            const parsedUrl = new URL(personData.mdxUrl);
            if (parsedUrl.protocol !== "https:") {
                return { success: false, message: "Error: MDX URL must use HTTPS." };
            }
            const allowedHosts = ["storage.googleapis.com", "firebasestorage.googleapis.com"];
            if (!allowedHosts.includes(parsedUrl.hostname) || !parsedUrl.pathname.includes("persons-mdx/")) {
                return { success: false, message: "Error: MDX URL must be from authorized storage path." };
            }
        } catch {
            return { success: false, message: "Error: Invalid MDX URL." };
        }
    }

    try {
        // Make the uploaded files public (since client has already finished GCS uploads)
        if (personData.profilePic) {
            await makeStorageFilePublic(personData.profilePic);
        }
        if (personData.mdxUrl) {
            await makeStorageFilePublic(personData.mdxUrl);
        }

        const slug = generateSlug(personData.name);
        const now = new Date();
        
        // Extract derived conditions
        const isLoveCorner = personData.category === "love corner";
        const addToTimeline = isLoveCorner ? personData.addToTimeline : false;
        const priority = isLoveCorner && addToTimeline ? (personData.priority ?? null) : null;

        // Base object for both Create and Update
        const basePersonData = {
            name: personData.name,
            slug,
            category: personData.category,
            gender: personData.gender,
            addToTimeline,
            priority,
            startOn: personData.startOn ?? null,
            endOn: personData.endOn ?? null,
            dob: personData.dob ?? null,
            phone: personData.phone ?? null,
            address: personData.address ?? null,
            info: personData.info ?? null,
            email: personData.email ?? null,
            updatedAt: now,
        };

        if (personData.id) {
            const docRef = PERSONS_COLLECTION.doc(personData.id);
            const docSnap = await docRef.get();

            if (!docSnap.exists) {
                return { success: false, message: "Error: Person not found." };
            }

            const existingData = docSnap.data() as PersonObject;

            // Allow explicit removal of profilePic (if null is passed)
            const updatedProfilePic = personData.profilePic !== undefined 
                ? personData.profilePic 
                : (existingData.profilePic || null);

            const updatedMdxUrl = personData.mdxUrl !== undefined
                ? personData.mdxUrl
                : (existingData.mdxUrl || null);

            // Clean up old files from storage asynchronously to keep storage clean
            if (personData.profilePic !== undefined && existingData.profilePic && existingData.profilePic !== personData.profilePic) {
                deleteStorageFileByUrl(existingData.profilePic).catch((err) =>
                    console.error("Failed to delete old profile pic:", err)
                );
            }

            if (personData.mdxUrl !== undefined && existingData.mdxUrl && existingData.mdxUrl !== personData.mdxUrl) {
                deleteStorageFileByUrl(existingData.mdxUrl).catch((err) =>
                    console.error("Failed to delete old MDX file:", err)
                );
            }

            await docRef.update({
                ...basePersonData,
                profilePic: updatedProfilePic,
                mdxUrl: updatedMdxUrl,
            });

            revalidatePath("/[lang]/about/love-corner", "page");
            return { success: true, message: "Person updated successfully!", personId: personData.id };
        } else {
            const docRef = PERSONS_COLLECTION.doc();
            
            await docRef.set({
                ...basePersonData,
                id: docRef.id,
                profilePic: personData.profilePic ?? null,
                mdxUrl: personData.mdxUrl ?? null,
                createdAt: now, 
            });

            revalidatePath("/[lang]/about/love-corner", "page");
            return { success: true, message: "Person added successfully!", personId: docRef.id };
        }
    } catch (error: unknown) {
        const em = getErrorMessage(error);
        console.error(em);
        return { success: false, message: em || "Failed to save person data." };
    }
}

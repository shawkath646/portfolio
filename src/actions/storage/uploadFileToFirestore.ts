"use server";
import { bucket } from "@/lib/firebase";

const uploadFileToFirestore = async (base64: string, fileName?: string) => {
    if (!base64 || base64.startsWith("http")) {
        return base64;
    }

    try {
        const matches = base64.match(/^data:(image\/\w+);base64,(.*)$/);
        if (!matches || matches.length !== 3) {
            throw new Error("Invalid base64 string format");
        }

        const contentType = matches[1];
        const imageData = matches[2];
        const extension = contentType.split("/")[1];

        const buffer = Buffer.from(imageData, "base64");

        const readableName = fileName
            ? fileName.replace(/\.[^/.]+$/, "")
            : `${contentType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const finalFileName = `${readableName}.${extension}`;

        const file = bucket.file(finalFileName);

        await file.save(buffer, {
            metadata: {
                contentType: contentType,
            },
        });

        await file.makePublic();
        return file.publicUrl();
    } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        throw new Error("Failed to upload image.");
    }
};

export default uploadFileToFirestore;

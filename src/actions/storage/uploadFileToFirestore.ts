"use server";

import { bucket } from "@/lib/firebase";

export const generateFileName = (contentType: string, fileName?: string): string => {
    const extension = contentType?.split("/")[1] ?? "file";
    const readableName = fileName
        ? fileName.replace(/\.[^/.]+$/, "")
        : `${contentType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    return `${readableName}.${extension}`;
};

const uploadFileToFirestore = async (base64: string, fileName?: string): Promise<string> => {
    if (!base64 || base64.startsWith("http")) {
        return base64;
    }

    const matches = base64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 string format");
    }

    const contentType = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, "base64");
    const finalFileName = generateFileName(contentType, fileName);
    const file = bucket.file(finalFileName);

    await file.save(buffer, {
        metadata: { contentType },
    });

    await file.makePublic();
    return file.publicUrl();
};

export default uploadFileToFirestore;

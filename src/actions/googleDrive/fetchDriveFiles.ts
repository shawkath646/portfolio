"use server";
import { cache } from "react";
import { getDriveClient } from "@/lib/googleDrive";

const drive = getDriveClient();

const fetchDriveFiles = cache(async (folderId: string) => {
    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, webViewLink, thumbnailLink)",
    });

    return response.data.files || [];
});

export default fetchDriveFiles;
"use client";

import { useState } from "react";
import FileSubmission from "./FileSubmission";
import UserUploadsList from "./UserUploadsList";

export default function SharePageClient() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadComplete = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            {/* Your Previous Uploads */}
            <UserUploadsList key={`uploads-list-${refreshKey}`} />

            {/* File Submission Component */}
            <div className="mt-8">
                <FileSubmission onUploadComplete={handleUploadComplete} />
            </div>
        </>
    );
}

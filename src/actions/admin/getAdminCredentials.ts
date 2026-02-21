"use server";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord } from "@/types/auth.types";
import { timestampToDate } from "@/utils/dateTime";
import { getAuthSession } from "../authentication/authActions";

export default async function getAdminCredentials(): Promise<AdminCredentialsRecord> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        throw new Error("Error: Permission denied! Session not found.");
    };

    const docRef = await db.collection("site-config").doc("admin-pass").get();
    const data = docRef.data() as AdminCredentialsRecord;

    data.lastChangedOn = timestampToDate(data.lastChangedOn);
    if (data.totpCreatedOn) {
        data.totpCreatedOn = timestampToDate(data.totpCreatedOn);
    }

    return data;
}
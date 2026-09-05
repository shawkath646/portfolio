import crypto from "crypto";
import { getAuthSession } from "@/actions/authentication/authSession";
import { getAllPersons } from "@/actions/person/getPersonData";
import { BASE_SITE_SCOPES, buildDynamicRouteScopes, RouteScope } from "@/data/site_scopes";
import { db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import { timestampToDate } from "@/utils/dateTime";
import { getEnv } from "@/utils/getEnv";

export function hashGenericPassword(password: string): string {
    const secret = getEnv("AUTH_TOKEN_SECRET");
    return crypto.createHmac("sha256", secret).update(password.trim()).digest("hex");
}

export interface GeneratePasswordPropsType {
    name: string;
    allowedRoutes: string[];
    expireDays: number;
    usableTimes: number | "unlimited";
}

export interface GeneratePasswordResponseType extends APIResponseType {
    password?: string;
}

export interface GetAllGenericPasswordResponseType extends APIResponseType {
    passwordList?: GenericAuthPasswordRecordType[];
    expiredCount?: number;
}

export async function getDynamicRouteScopes(): Promise<RouteScope[]> {
    try {
        const persons = await getAllPersons();
        return buildDynamicRouteScopes(persons);
    } catch (error) {
        console.error("Failed to load dynamic route scopes:", error);
        return BASE_SITE_SCOPES;
    }
}

export const getAllPasswords = async (): Promise<GetAllGenericPasswordResponseType> => {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found.",
        };
    }

    const passwordSnapshot = await db.collection("generic-passwords").get();
    const now = Date.now();
    let expiredCount = 0;

    const passwordList: GenericAuthPasswordRecordType[] =
        passwordSnapshot.docs.map((doc) => {
            const data = doc.data() as GenericAuthPasswordRecordType;

            const createdAt = timestampToDate(data.createdAt);
            const expiresAt = timestampToDate(data.expiresAt);

            if (expiresAt.getTime() <= now) {
                expiredCount++;
            }

            return {
                id: doc.id,
                name: data.name || "Unnamed Key",
                allowedRoutes: data.allowedRoutes || [],
                usableTimes: data.usableTimes,
                usedTimes: data.usedTimes || 0,
                createdAt,
                expiresAt,
            };
        });

    return {
        success: true,
        message: "Password list fetched successfully.",
        passwordList,
        expiredCount,
    };
};

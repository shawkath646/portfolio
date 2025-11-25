"use server";
import { cookies } from "next/headers";
import { verifyTokens } from "@/lib/auth";
import { SiteCodeType } from "@/types";

/**
 * Check if user has access to a restricted page
 * Returns true if user is either:
 * 1. Logged in as admin (admin-panel token)
 * 2. Has valid temporary password token for the specific site
 */
export async function checkPageAccess(siteCode: SiteCodeType): Promise<boolean> {
    const cookieStore = await cookies();

    // Check admin access first
    const adminToken = cookieStore.get('admin-panel_access_token');
    if (adminToken?.value) {
        const adminValid = await verifyTokens(adminToken.value, "admin-panel");
        if (adminValid) return true;
    }

    // Check temporary password access
    const siteToken = cookieStore.get(`${siteCode}_access_token`);
    if (siteToken?.value) {
        const siteValid = await verifyTokens(siteToken.value, siteCode);
        if (siteValid) return true;
    }

    return false;
}

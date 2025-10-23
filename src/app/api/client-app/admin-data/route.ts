import { NextRequest, NextResponse } from "next/server";
import { withClientAppAuth } from "@/lib/withClientAppAuth";
import getAdminData from "@/actions/admin/getAdminData";

// Protected route handler
async function handler(req: NextRequest) {
    try {
        // Get admin data
        const adminData = await getAdminData();
        
        // Return admin data
        return NextResponse.json({
            success: true,
            data: adminData
        });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        
        return NextResponse.json({
            success: false,
            message: "Failed to fetch admin data"
        }, { status: 500 });
    }
}

// Export the handler with authentication middleware
export const GET = withClientAppAuth(handler);
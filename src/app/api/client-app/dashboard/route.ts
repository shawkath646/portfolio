import { NextResponse } from "next/server";
import getAdminData from "@/actions/admin/getAdminData";

export async function GET() {
    try {
        const adminData = await getAdminData();
        adminData.profilePictureUrl = "/profile.jpg";

        return NextResponse.json({
            success: true,
            data: adminData
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch admin data"
        }, { status: 500 });
    }
}

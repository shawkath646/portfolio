import { NextResponse } from "next/server";
import withClientAppAuth from "@/utils/withClientAppAuth";
import getAdminData from "@/actions/admin/getAdminData";

async function handler() {
    try {
        const adminData = await getAdminData();
        
        return NextResponse.json({
            success: true,
            data: adminData
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch admin data"
        }, { status: 500 });
    }
}

export const GET = withClientAppAuth(handler);
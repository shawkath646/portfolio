import { NextResponse } from "next/server";
import { performLogout } from "@/actions/authentication/authActions";

export async function POST() {
    try {
        const response = await performLogout();
        return NextResponse.json(response, { status: 200 });
    } catch {
        return NextResponse.json(
            { success: false, message: "An internal server error occurred" },
            { status: 500 }
        );
    }
}


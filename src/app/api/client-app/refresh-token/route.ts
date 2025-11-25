import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { refreshClientAppTokens } from "@/lib/auth";
import { getClientIP } from "@/utils/getClientIP";


export async function POST(req: NextRequest) {
    const headersList = await headers();
    const { access_token } = await req.json();

    // Securely extract client IP with anti-spoofing protection
    const validatedIP = headersList.get("x-validated-ip");
    const clientIP = validatedIP || getClientIP(headersList);

    if (!clientIP) {
        return NextResponse.json(
            { success: false, message: "Unable to verify client identity. Please ensure you're not using a VPN or proxy." },
            { status: 400 }
        );
    }

    if (!access_token) {
        return NextResponse.json(
            { success: false, message: "Access token not provided in body!" },
            { status: 400 }
        );
    }

    const response = await refreshClientAppTokens(access_token, clientIP);
    const status = response.success ? 200 : 401;
    return NextResponse.json(response, { status });
}

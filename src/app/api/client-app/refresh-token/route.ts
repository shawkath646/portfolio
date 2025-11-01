import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { refreshClientAppTokens } from "@/utils/tokens";


export async function POST(req: NextRequest) {
    const headersList = await headers();
    const { access_token } = await req.json();

    const rawIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const clientIP = rawIP ? rawIP.split(',')[0].trim() : null;

    if (!clientIP) {
        return NextResponse.json(
            { success: false, message: "Unable to determine client IP address." },
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

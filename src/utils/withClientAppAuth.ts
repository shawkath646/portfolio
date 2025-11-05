import { NextRequest, NextResponse } from "next/server";
import { verifyTokens } from "@/lib/auth";

type RouteHandler = (
    request: NextRequest,
    context?: { params: Promise<Record<string, string | string[]>> }
) => Promise<Response>;

function withClientAppAuth(handler: RouteHandler): RouteHandler {
    return async (request: NextRequest, context) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing or invalid Authorization header" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing access token" },
                { status: 401 }
            );
        }

        let verifyResult = await verifyTokens(token, "client-app");
        if (!verifyResult) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        const requestHeaders = new Headers(request.headers);

        const newRequest = new NextRequest(request.url, {
            method: request.method,
            body: request.body,
            headers: requestHeaders,
        });

        return handler(newRequest, context);
    };
}

export default withClientAppAuth;
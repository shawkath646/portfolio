import { NextRequest, NextResponse } from "next/server";
import { AuthTokensType } from "@/types/auth.types";
import { getEnv } from "@/utils/getEnv";
import { verifyToken } from "@/utils/tokens";
import { refreshAuthSession } from "./authSession";

const CLIENT_APP_API_KEY = getEnv("CLIENT_APP_API_KEY");
const ADMIN_LOGIN_URL = "/admin/login";

const PUBLIC_ROUTES = {
    admin: new Set(["/admin/login"]),
    client: new Set(["/api/client-app/login"]),
};

export async function handleAdminRequest(request: NextRequest, requestHeaders: Headers) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ROUTES.admin.has(pathname)) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!accessToken || !refreshToken) {
        return redirectToLogin(request);
    }

    const sessionId = await verifyToken(accessToken);
    if (sessionId) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const refreshedTokens = await refreshAuthSession(refreshToken);

    if (!refreshedTokens) {
        return redirectToLogin(request);
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    setAuthCookies(response, refreshedTokens);
    return response;
}

export async function handleClientApiRequest(request: NextRequest, requestHeaders: Headers) {
    const { pathname } = request.nextUrl;

    const apiKey = requestHeaders.get("x-api-key");
    const platformType = requestHeaders.get("x-device-platform");

    if (!apiKey || apiKey !== CLIENT_APP_API_KEY) {
        return NextResponse.json(
            { success: false, message: "Forbidden: Invalid API Key" },
            { status: 403 }
        );
    }

    if (!platformType || (platformType !== "android" && platformType !== "desktop")) {
        return NextResponse.json(
            { success: false, message: "Invalid platform type!" },
            { status: 400 }
        );
    }

    if (PUBLIC_ROUTES.client.has(pathname)) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const authHeader = requestHeaders.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: Missing Authorization header" },
            { status: 401 }
        );
    }

    const token = authHeader.substring(7);
    const sessionId = await verifyToken(token);

    if (sessionId) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const refreshTokenHeader = requestHeaders.get("x-refresh-token");
    if (!refreshTokenHeader) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: Access token expired and no refresh token provided" },
            { status: 401 }
        );
    }

    const newTokens = await refreshAuthSession(refreshTokenHeader);

    if (!newTokens) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: Session expired, please login again" },
            { status: 401 }
        );
    }

    requestHeaders.set("Authorization", `Bearer ${newTokens.accessToken}`);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    response.headers.set("x-new-access-token", newTokens.accessToken);
    response.headers.set("x-new-refresh-token", newTokens.refreshToken);

    return response;
}

function redirectToLogin(request: NextRequest) {
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN_URL, request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
}

function setAuthCookies(response: NextResponse, tokens: AuthTokensType) {
    response.cookies.set("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: new Date(tokens.accessTokenExpireAt),
    });

    response.cookies.set("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: new Date(tokens.refreshTokenExpireAt),
    });
}
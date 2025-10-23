import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import verifyTokens from './utils/verifyTokens';

const CLIENT_APP_API_KEY = process.env.CLIENT_APP_API_KEY;
if (!CLIENT_APP_API_KEY) throw Error("Error: CLIENT_APP_API_KEY not found!");


export default async function proxy(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url-path', request.nextUrl.pathname);

    const loginUrl = new URL('/admin/login', request.url);

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next({
                request: { headers: requestHeaders },
            });
        }

        const adminToken = request.cookies.get('admin-panel_access_token');
        if (!adminToken?.value) return NextResponse.redirect(loginUrl);

        const tokenValid =  verifyTokens(adminToken.value, "admin-panel");

        if (!tokenValid) {
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('admin-panel_access_token');
            return response;
        }
    }
    else if (request.nextUrl.pathname.startsWith('/api/client-app')) {
        const apiKey = requestHeaders.get("x-api-key");

        if (!apiKey) {
            console.warn('API access denied: Missing x-api-key header.');
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required. Missing x-api-key header."
                },
                { status: 401 }
            );
        }

        if (apiKey !== CLIENT_APP_API_KEY) {
            console.warn('API access denied: Invalid API Key provided.');
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication failed. The provided API Key is invalid."
                },
                { status: 401 }
            );
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    //runtime: 'nodejs',
    matcher: [
        '/admin/:path*',
        '/api/client-app/:path*',
        '/',
    ],
};

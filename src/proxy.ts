import { NextRequest, NextResponse } from "next/server";
import { handleAdminRequest, handleClientApiRequest } from "@/actions/authentication/proxyHelperFunctions";
import { isActiveFlag } from "@/lib/flags";
import maintenanceHTML from "./data/maintenanceHTML";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-path", pathname);

  const isActive = await isActiveFlag();

  if (!isActive && pathname !== '/maintenance') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Service unavailable due to maintenance' },
        { status: 503 }
      );
    }

    return new NextResponse(maintenanceHTML, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600',
      },
    });
  }

  if (pathname.startsWith("/admin")) {
    return handleAdminRequest(request, requestHeaders);
  }

  if (pathname.startsWith("/api/client-app")) {
    return handleClientApiRequest(request, requestHeaders);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
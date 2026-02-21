import { NextRequest, NextResponse } from "next/server";
import { handleAdminRequest, handleClientApiRequest } from "@/actions/authentication/proxyHelperFunctions";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-path", pathname);

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
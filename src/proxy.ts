import { NextRequest, NextResponse } from "next/server";
import { handleAdminRequest, handleClientApiRequest } from "@/actions/authentication/proxyHelperFunctions";
import { isActiveFlag } from "@/lib/flags";
import maintenanceHTML from "./data/maintenanceHTML";
import { locales, getLocale } from "./lib/locale";


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

  if (pathname.startsWith('/api/')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);

    const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    const newUrl = new URL(newPath, request.url);

    newUrl.search = request.nextUrl.search;

    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)',
  ],
};
import { NextRequest, NextResponse } from "next/server";
import { handleAdminRequest, handleClientApiRequest } from "@/actions/authentication/proxyHelperFunctions";
import { locales, getLocale } from "./lib/locale";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (pathname.startsWith("/admin")) {
    return handleAdminRequest(request, requestHeaders);
  }

  if (pathname.startsWith("/api/client-app")) {
    return handleClientApiRequest(request, requestHeaders);
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // If someone visits /en/embedded-card or /ko/embedded-card (e.g. from browser cache or old link), redirect to /embedded-card
  for (const l of locales) {
    if (pathname === `/${l}/embedded-card` || pathname.startsWith(`/${l}/embedded-card/`)) {
      const cleanPath = pathname.replace(`/${l}`, "");
      const newUrl = new URL(cleanPath, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl, { status: 307 });
    }
  }

  if (pathname.startsWith('/embedded-card')) {
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

    return NextResponse.redirect(newUrl, { status: 307 });
  }

  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-search", request.nextUrl.search);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|embedded-card|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|opengraph-image\\.png|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)',
  ],
};
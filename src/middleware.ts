import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { internalToOpaque, opaqueToInternal } from "@/lib/paths";

const REWRITE_HEADER = "x-ayadina-rewrite";

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  if (request.headers.get(REWRITE_HEADER) === "1") {
    return NextResponse.next();
  }

  const internal = opaqueToInternal[pathname];
  if (internal) {
    const url = request.nextUrl.clone();
    url.pathname = internal;
    const headers = new Headers(request.headers);
    headers.set(REWRITE_HEADER, "1");
    return NextResponse.rewrite(url, { request: { headers } });
  }

  const opaque = internalToOpaque[pathname];
  if (opaque) {
    const url = request.nextUrl.clone();
    url.pathname = opaque;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/menu",
    "/menu/",
    "/offers",
    "/offers/",
    "/about",
    "/about/",
    "/contact",
    "/contact/",
    "/admin/:path*",
    "/p/:path*",
  ],
};

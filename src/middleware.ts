import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const cookieStore = request.cookies;
    const sessionToken = cookieStore.get("sessionToken")?.value || null;

    const path = request.nextUrl.pathname;
    const isAuthPath = path.startsWith("/auth/");
    const isLogout = path.includes("/logout");

    if (sessionToken && isAuthPath && !isLogout) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!sessionToken && !isAuthPath) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/:path*", "/me", "/products/add", "/products/:id/edit"],
};

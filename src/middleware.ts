import { NextResponse, NextRequest } from "next/server";

const configPaths = {
    authPaths: ["/auth/:path*"],
    privatePaths: ["/me"],
} as const;

export function middleware(request: NextRequest) {
    const cookieStore = request.cookies;
    const sessionToken = cookieStore.get("sessionToken")?.value || null;
    const isAuthPath = request.nextUrl.pathname.startsWith("/auth/");
    const isPrivatePath = configPaths.privatePaths.some((path) => request.nextUrl.pathname.startsWith(path));
    if (sessionToken && isAuthPath) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!sessionToken && isPrivatePath) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [...configPaths.authPaths, ...configPaths.privatePaths],
};

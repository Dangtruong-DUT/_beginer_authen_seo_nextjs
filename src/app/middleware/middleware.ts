import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("pathName request in server", request.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/*", "/me"],
};

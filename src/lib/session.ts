import { NextResponse } from "next/server";

export function clearSessionCookie(res: NextResponse) {
    res.cookies.set("sessionToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
    return res;
}

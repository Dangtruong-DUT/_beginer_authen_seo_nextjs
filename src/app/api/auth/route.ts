import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const header = new Headers(request.headers);
    header.set("Content-Type", "application/json");

    const req = await request.json();
    const sessionToken = req?.token;
    if (!sessionToken) {
        return NextResponse.json({ message: "No session token provided" }, { status: 400, headers: header });
    }
    const res = NextResponse.json(req, { status: 200, headers: header });
    res.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
    });
    return res;
}

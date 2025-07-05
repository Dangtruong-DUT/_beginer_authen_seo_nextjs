import { decodeJwtToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export type PayloadJwt = {
    iat: number;
    exp: number;
    userId: number;
    tokenType: string;
};

export async function POST(request: NextRequest) {
    const header = new Headers(request.headers);
    header.set("Content-Type", "application/json");

    const req = await request.json();
    const sessionToken = req?.sessionToken;
    if (!sessionToken) {
        return NextResponse.json({ message: "No session token provided" }, { status: 400, headers: header });
    }

    const jwtPayload = decodeJwtToken<PayloadJwt>(sessionToken);

    const res = NextResponse.json(req, { status: 200, headers: header });
    res.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        expires: new Date(jwtPayload.exp * 1000),
        sameSite: "lax",
        secure: true,
    });
    return res;
}

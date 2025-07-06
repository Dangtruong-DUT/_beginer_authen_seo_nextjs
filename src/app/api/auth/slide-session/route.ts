import authApiRequest from "@/apiRequest/auth.api";
import { httpError } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const header = new Headers(request.headers);
        header.set("Content-Type", "application/json");
        const cookieStore = request.cookies;
        const sessionToken = cookieStore.get("sessionToken")?.value || null;
        if (!sessionToken) {
            return NextResponse.json({ message: "No session token provided" }, { status: 400, headers: header });
        }
        const responseFromBackend = await authApiRequest.sliceSessionTokenFromNextServerToServer(sessionToken);
        const res = NextResponse.json(responseFromBackend.payload, { status: 200, headers: header });
        res.cookies.set("sessionToken", responseFromBackend.payload.data.token, {
            httpOnly: true,
            expires: new Date(responseFromBackend.payload.data.expiresAt),
            sameSite: "lax",
            secure: true,
        });
        return res;
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        console.error("Error during logout:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

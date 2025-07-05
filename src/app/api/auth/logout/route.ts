import authApiRequest from "@/apiRequest/auth.api";
import { httpError } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const sessionToken = request.cookies.get("sessionToken")?.value || null;
    if (!sessionToken) {
        return NextResponse.json({ message: "No session token provided" }, { status: 400 });
    }
    try {
        const response = await authApiRequest.logoutFromNextServerToServer(sessionToken);
        const headers = new Headers(request.headers);
        console.log(headers.entries());
        const res = NextResponse.json(response.payload, { status: response.status });
        res.cookies.set("sessionToken", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res;
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        } else {
            console.error("Error during logout:", error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }
}

import authApiRequest from "@/apiRequest/auth.api";
import { httpError } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const sessionToken = request.cookies.get("sessionToken")?.value;

    if (!sessionToken) {
        return NextResponse.json({ message: "No session token provided" }, { status: 400 });
    }

    try {
        const { force = false } = await request.json();

        if (force) {
            return clearSessionCookie(NextResponse.json({ message: "Force logout successful" }, { status: 200 }));
        }

        const response = await authApiRequest.logoutFromNextServerToServer(sessionToken);

        return clearSessionCookie(NextResponse.json(response.payload, { status: response.status }));
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        console.error("Error during logout:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export function clearSessionCookie(res: NextResponse) {
    res.cookies.set("sessionToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
    return res;
}

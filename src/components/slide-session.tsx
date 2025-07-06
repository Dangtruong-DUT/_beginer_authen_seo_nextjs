"use client";

import authApiRequest from "@/apiRequest/auth.api";
import { clientSessionToken } from "@/lib/http";
import { differenceInHours } from "date-fns";
import { useEffect } from "react";

function SlideSession() {
    useEffect(() => {
        const timer = setInterval(() => {
            const SlideSession = async () => {
                try {
                    if (!clientSessionToken.value) return;
                    const res = await authApiRequest.sliceSessionTokenFromClientToNextServer();
                    clientSessionToken.expiresAt = res.payload.data.expiresAt;
                    clientSessionToken.expiresAt = res.payload.data.token;
                } catch (error) {
                    console.error("Error sliding session:", error);
                }
            };
            const now = new Date();
            const expiresAt = new Date(clientSessionToken.expiresAt);
            if (differenceInHours(now, expiresAt) < 1) {
                console.log("Sliding session token");
                console.log("now time", now.toISOString());
                console.log("expiresAt time", expiresAt.toISOString());
                SlideSession();
            }
        }, 1000 * 60 * 30);
        return () => clearInterval(timer);
    }, []);

    return <></>;
}

export default SlideSession;

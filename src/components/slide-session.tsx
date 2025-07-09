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
                    const { expiresAt, token } = res.payload.data;
                    clientSessionToken.expiresAt = expiresAt;
                    clientSessionToken.expiresAt = token;
                } catch (error) {
                    console.error("Error sliding session:", error);
                }
            };
            const now = new Date();
            const expiresAt =
                clientSessionToken.expiresAt != null ? new Date(clientSessionToken.expiresAt) : new Date();
            if (differenceInHours(now, expiresAt) < 1) {
                SlideSession();
            }
        }, 1000 * 60 * 30);
        return () => clearInterval(timer);
    }, []);

    return <></>;
}

export default SlideSession;

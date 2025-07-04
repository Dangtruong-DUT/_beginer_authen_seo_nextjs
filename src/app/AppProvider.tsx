"use client";

import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

function AppProvider({
    initialSessionToken,
    children,
}: {
    initialSessionToken: string | null;
    children: React.ReactNode;
}) {
    useState(() => {
        if (initialSessionToken && typeof window !== "undefined") {
            clientSessionToken.value = initialSessionToken;
        }
    });

    return <>{children}</>;
}

export default AppProvider;

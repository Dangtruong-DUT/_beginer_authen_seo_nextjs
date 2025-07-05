"use client";

import authApiRequest from "@/apiRequest/auth.api";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function LogoutPage() {
    const router = useRouter();
    const pathName = usePathname();
    const sessionToken = useSearchParams().get("sessionToken");

    useEffect(() => {
        const logout = async () => {
            try {
                await authApiRequest.logoutFromNextClientToNextServer({ force: true });
                clientSessionToken.value = null;
                router.push("/auth/login?redirectFrom=" + pathName);
            } catch (error) {
                handleErrorApi(error);
            }
        };
        if (sessionToken == clientSessionToken.value) {
            logout();
        } else {
            toast.error("Session token mismatch. Please log in again.");
        }
    }, [pathName, router, sessionToken]);
    useEffect(() => {
        if (!clientSessionToken.value) {
            router.replace("/auth/login");
        }
    }, [router]);

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center font-sans">
            <div className="flex items-center">
                <h1 className="border-r border-black dark:border-white pr-6 mr-5 text-2xl font-medium leading-[49px] inline-block">
                    Signing Out
                </h1>
                <div className="inline-block">
                    <h2 className="text-sm font-normal leading-[49px] m-0">Please wait while we log you out...</h2>
                </div>
            </div>
        </div>
    );
}

export default LogoutPage;

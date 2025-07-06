"use client";

import authApiRequest from "@/apiRequest/auth.api";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ButtonLogout() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await authApiRequest.logoutFromNextClientToNextServer({ force: false });
            toast.success("Logout successful");
        } catch (error) {
            handleErrorApi(error);
            await authApiRequest.logoutFromNextClientToNextServer({ force: true });
        } finally {
            router.push("/auth/login");
        }
    };
    return (
        <Button size={"sm"} onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default ButtonLogout;

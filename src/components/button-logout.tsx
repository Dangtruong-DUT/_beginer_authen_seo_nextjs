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
            await authApiRequest.logoutFromNextClientToNextServer();
            router.push("/");
            toast.success("Logout successful");
        } catch (error) {
            handleErrorApi(error);
        }
    };
    return (
        <Button size={"sm"} onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default ButtonLogout;

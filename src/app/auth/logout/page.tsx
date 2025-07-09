import LogoutLogic from "@/app/auth/logout/logout";
import { Suspense } from "react";

function LogoutPage() {
    return (
        <Suspense>
            <LogoutLogic />
        </Suspense>
    );
}

export default LogoutPage;

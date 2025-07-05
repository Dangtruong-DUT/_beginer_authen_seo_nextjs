import accountApi from "@/apiRequest/account.api";
import Profile from "@/app/me/profile";
import Header from "@/components/header";
import { cookies } from "next/headers";

export async function fetchUserProfile() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken");
    if (!sessionToken?.value) {
        throw new Error("Session token not found");
    }
    const response = await accountApi.me(sessionToken.value || "");

    return response;
}

async function UserProfilePage() {
    const userProfile = await fetchUserProfile();
    return (
        <main>
            <header>
                <Header />
                <h1 className="text-2xl font-bold">Me Page</h1>
            </header>

            <section className="flex flex-row gap-1 items-center justify-center mt-4">
                <p className="text-xl  font-normal">Xin Chào</p>
                <h2 className="text-xl  font-bold text-red-400">{userProfile?.payload?.data?.name || "__"}</h2>
            </section>
            <section>
                <Profile />
            </section>

            <section className="flex justify-center mt-[1rem]">{/* Add your content here */}</section>
        </main>
    );
}

export default UserProfilePage;

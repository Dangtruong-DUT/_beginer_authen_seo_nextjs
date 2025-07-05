import accountApi from "@/apiRequest/account.api";
import Header from "@/components/header";
import { cookies } from "next/headers";

export async function fetchUserProfile() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken");
        if (!sessionToken?.value) {
            throw new Error("Session token not found");
        }
        const response = await accountApi.me(sessionToken.value || "");

        return response;
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
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

            <section className="flex justify-center mt-[1rem]">{/* Add your content here */}</section>
        </main>
    );
}

export default UserProfilePage;

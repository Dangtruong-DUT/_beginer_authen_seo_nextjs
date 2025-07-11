import accountApi from "@/apiRequest/account.api";
import ProfileForm from "@/app/me/profile-form";
import { cookies } from "next/headers";

async function UserProfilePage() {
    async function fetchUserProfile() {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken");
        if (!sessionToken?.value) {
            throw new Error("Session token not found");
        }
        const response = await accountApi.me(sessionToken.value || "");

        return response;
    }
    const userProfile = await fetchUserProfile();
    return (
        <main>
            <header>
                <h1 className="text-2xl font-bold">Me Page</h1>
            </header>

            <section className="flex flex-row gap-1 items-center justify-center mt-4">
                <p className="text-xl  font-normal">Xin Chào</p>
                <h2 className="text-xl  font-bold text-red-400">{userProfile?.payload?.data?.name || "__"}</h2>
            </section>
            <section>
                <ProfileForm />
            </section>

            <section className="flex justify-center mt-[1rem]">{/* Add your content here */}</section>
        </main>
    );
}

export default UserProfilePage;

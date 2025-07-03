import { envConfig } from "@/config";
import { cookies } from "next/headers";

export async function fetchUserProfile() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken");

        const responseFromBackend = await fetch(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/account/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken?.value}`,
            },
        });
        const payloadFromBackend = await responseFromBackend.json();
        const dataWithStatus = {
            status: responseFromBackend.status,
            payload: payloadFromBackend,
        };
        if (!responseFromBackend.ok) {
            throw dataWithStatus;
        }

        return dataWithStatus;
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
}

async function UserProfilePage() {
    const userProfile = await fetchUserProfile();
    console.log("User Profile Data:", userProfile?.payload);
    return (
        <main>
            <header>
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

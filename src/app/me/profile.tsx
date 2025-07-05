"use client";

import accountApi from "@/apiRequest/account.api";
import { handleErrorApi } from "@/lib/utils";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useEffect, useState } from "react";

function Profile() {
    const [profile, setProfile] = useState<AccountResType | null>(null);
    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await accountApi.meClient();
                setProfile(response.payload);
            } catch (error) {
                handleErrorApi(error);
            }
        };
        getProfile();
    }, []);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-gray-700">This is your profile page.</p>
            <p className="text-gray-500">You can view and edit your profile information here.</p>
            <p>{profile && JSON.stringify(profile)}</p>
        </div>
    );
}

export default Profile;

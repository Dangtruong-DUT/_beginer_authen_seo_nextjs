import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
    SlideSessionResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
    login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    register: (body: RegisterBodyType) => http.post<RegisterResType>("/auth/register", body),
    auth: (body: { sessionToken: string; expiresAt: string }) =>
        http.post("/api/auth", body, {
            baseUrl: "",
        }),
    logoutFromNextServerToServer: (sessionToken: string) =>
        http.post<MessageResType>(
            "/auth/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            }
        ),
    logoutFromNextClientToNextServer: ({ force = false }: { force: boolean }) =>
        http.post<MessageResType>(
            "/api/auth/logout",
            {
                force,
            },
            {
                baseUrl: "",
            }
        ),
    sliceSessionTokenFromNextServerToServer: (sessionToken: string) =>
        http.post<SlideSessionResType>(
            "/auth/slide-session",
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            }
        ),
    sliceSessionTokenFromClientToNextServer: () =>
        http.post<SlideSessionResType>(
            "/api/auth/slide-session",
            {},
            {
                baseUrl: "",
            }
        ),
};

export default authApiRequest;

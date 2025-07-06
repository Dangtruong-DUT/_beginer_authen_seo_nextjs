import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApi = {
    me: (sessionToken: string) =>
        http.get<AccountResType>("/account/me", { headers: { Authorization: `Bearer ${sessionToken}` } }),
    meClient: () => http.get<AccountResType>("/account/me"),
    UpdateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/account/me", body),
};

export default accountApi;

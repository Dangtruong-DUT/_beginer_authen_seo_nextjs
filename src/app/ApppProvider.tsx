"use client";

import { createContext, useContext, useState } from "react";

type AppContextType = {
    sessionToken: string | null;
    setSessionToken: (token: string | null) => void;
};
export const AppContext = createContext<AppContextType>({
    sessionToken: null,
    setSessionToken: () => {},
});

export const useAppContext = () => useContext(AppContext);

function AppProvider({
    initialSessionToken,
    children,
}: {
    initialSessionToken: string | null;
    children: React.ReactNode;
}) {
    const [sessionToken, setSessionToken] = useState<string | null>(initialSessionToken);

    return <AppContext.Provider value={{ sessionToken, setSessionToken }}>{children}</AppContext.Provider>;
}

export default AppProvider;

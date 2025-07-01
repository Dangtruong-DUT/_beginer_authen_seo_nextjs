import Header from "@/components/header";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
}

export default AuthLayout;

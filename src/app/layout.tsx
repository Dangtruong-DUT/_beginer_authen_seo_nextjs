import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AppProvider from "@/app/app-provider";
import { cookies } from "next/headers";
import SlideSession from "@/components/slide-session";
import Header from "@/components/header";

export const metadata: Metadata = {
    title: {
        template: "%s | Products",
        default: "web-restaurant",
    },
    description: "A restaurant management web application built with Next.js",
};

const inter = Inter({
    subsets: ["vietnamese"],
    variable: "--font-inter",
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value || null;

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Header />
                    <AppProvider initialSessionToken={sessionToken}>{children}</AppProvider>
                    <Toaster />
                    <SlideSession />
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Header />
                    {children}
                    <Toaster />
                    <SlideSession />
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ComparisonModal } from "@/components/chat/comparison-modal";
import { FloatingChatButton } from "@/components/chat/floating-chat-button";
import { Analytics } from "@vercel/analytics/react";

const unbounded = Unbounded({
    subsets: ["latin"],
    variable: "--font-unbounded",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Blaqhole - AI Creative Suite",
    description: "Unleash your creativity with Blaqhole's advanced AI tools.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.variable} ${unbounded.variable} font-sans bg-background text-foreground antialiased`}>
                <Providers>
                    {children}
                    <ComparisonModal />
                    <FloatingChatButton />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}

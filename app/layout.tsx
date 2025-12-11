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
    title: "BQ - AI Tool Discovery",
    description: "Find the best AI tools for your needs with real-time research.",
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

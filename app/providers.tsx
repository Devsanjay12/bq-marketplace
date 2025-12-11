"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ComparisonProvider } from "@/lib/context/comparison-context";
import { BookmarksProvider } from "@/lib/context/bookmarks-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
            >
                <ComparisonProvider>
                    <BookmarksProvider>
                        {children}
                    </BookmarksProvider>
                </ComparisonProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}

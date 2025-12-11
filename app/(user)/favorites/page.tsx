"use client";

import { Header } from "@/components/shared/header";
import { ToolGrid } from "@/components/marketplace/tool-grid";
import { useBookmarks } from "@/lib/context/bookmarks-context";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
    const { bookmarks } = useBookmarks();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
                    <p className="text-muted-foreground">
                        Tools you have bookmarked.
                    </p>
                </div>

                {bookmarks.length > 0 ? (
                    <ToolGrid tools={bookmarks as any} />
                ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground mb-4">
                            You haven't bookmarked any tools yet.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

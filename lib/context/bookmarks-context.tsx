"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tool } from "@/types";

interface BookmarksContextType {
    bookmarks: Tool[];
    toggleBookmark: (tool: Tool) => void;
    isBookmarked: (tool: Tool) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
    const [bookmarks, setBookmarks] = useState<Tool[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("bq_bookmarks");
        if (saved) {
            try {
                setBookmarks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse bookmarks", e);
            }
        }
    }, []);

    const toggleBookmark = (tool: Tool) => {
        setBookmarks((prev) => {
            const isBookmarked = prev.some((b) => b.name === tool.name);
            let newBookmarks;
            if (isBookmarked) {
                newBookmarks = prev.filter((b) => b.name !== tool.name);
            } else {
                newBookmarks = [...prev, tool];
            }
            localStorage.setItem("bq_bookmarks", JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const isBookmarked = (tool: Tool) => {
        return bookmarks.some((b) => b.name === tool.name);
    };

    return (
        <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarksContext);
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarksProvider");
    }
    return context;
}

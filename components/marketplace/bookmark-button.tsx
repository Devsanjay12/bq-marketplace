"use client";

import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/context/bookmarks-context";
import { Tool } from "@/types";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface BookmarkButtonProps {
    tool: Tool;
}

export function BookmarkButton({ tool }: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [bookmarked, setBookmarked] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setBookmarked(isBookmarked(tool));
    }, [isBookmarked, tool]);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon">
                <Bookmark className="w-4 h-4" />
            </Button>
        );
    }

    const handleClick = () => {
        toggleBookmark(tool);
        setBookmarked(!bookmarked);
    };

    return (
        <Button
            variant={bookmarked ? "default" : "outline"}
            size="icon"
            onClick={handleClick}
            title={bookmarked ? "Remove from favorites" : "Add to favorites"}
        >
            {bookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
            ) : (
                <Bookmark className="w-4 h-4" />
            )}
        </Button>
    );
}

"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import { useBookmarks } from "@/lib/context/bookmarks-context";
import { Badge } from "@/components/ui/badge";

export function BookmarksSheet() {
    const { bookmarks, toggleBookmark } = useBookmarks();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bookmark className="h-5 w-5" />
                    {bookmarks.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {bookmarks.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-primary" /> Saved Tools
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                    {bookmarks.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No saved tools yet.</p>
                            <p className="text-sm mt-1">Bookmark tools to access them quickly later.</p>
                        </div>
                    ) : (
                        bookmarks.map((tool, i) => (
                            <div key={i} className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30">
                                <div>
                                    <h4 className="font-bold">{tool.name}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{tool.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px]">{tool.pricingModel}</Badge>
                                        {tool.websiteUrl && (
                                            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 hover:underline text-primary">
                                                Visit <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => toggleBookmark(tool)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

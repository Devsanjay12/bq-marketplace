"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useSearchParams } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const isChat = pathname?.startsWith("/chat");

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Blaqhole
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/browse"
                            className={pathname === "/browse" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground"}
                        >
                            Browse
                        </Link>
                        <Link
                            href="/categories"
                            className={pathname === "/categories" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground"}
                        >
                            Categories
                        </Link>
                        <Link
                            href="/chat"
                            className={pathname === "/chat" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground"}
                        >
                            AI Assistant
                        </Link>
                        <Link
                            href="/z-image"
                            className={pathname === "/z-image" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground"}
                        >
                            Z-Image
                        </Link>
                    </nav>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <Link href="/" className="flex items-center">
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span className="font-bold">Blaqhole</span>
                        </Link>
                        <nav className="flex flex-col gap-4 mt-4">
                            <Link href="/browse" className="text-sm font-medium">Browse</Link>
                            <Link href="/categories" className="text-sm font-medium">Categories</Link>
                            <Link href="/chat" className="text-sm font-medium">AI Assistant</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {!isChat && (
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tools..."
                                    className="pl-8 h-9 md:w-[300px] lg:w-[400px]"
                                    defaultValue={useSearchParams()?.get("search") || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const value = e.currentTarget.value;
                                            const params = new URLSearchParams(window.location.search);
                                            if (value) {
                                                params.set("search", value);
                                            } else {
                                                params.delete("search");
                                            }
                                            // Use window.location to force a refresh if needed, or router.push
                                            // router.push(`/browse?${params.toString()}`);
                                            // Actually, we need to import useRouter
                                            window.location.href = `/browse?${params.toString()}`;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <nav className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">
                                Sign Up
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

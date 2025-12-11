"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingChatButton() {
    const pathname = usePathname();

    // Don't show on chat page
    if (pathname?.startsWith("/chat")) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Link href="/chat">
                <Button size="lg" className="rounded-full h-14 w-14 shadow-xl bg-primary hover:bg-primary/90">
                    <MessageSquarePlus className="h-6 w-6" />
                </Button>
            </Link>
        </div>
    );
}

import { Message } from "@/types";
import { ChatMessage } from "./message";
import { LoadingState } from "./loading-state";
import { useEffect, useRef } from "react";

interface ChatListProps {
    messages: Message[];
    isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto pb-32 pt-4">
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
                <div className="p-4 md:p-6 bg-muted/30">
                    <LoadingState />
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

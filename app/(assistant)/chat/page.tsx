"use client";

import { useState, useEffect } from "react";
import { Message, ToolGroup } from "@/types";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatList } from "@/components/chat/chat-list";
import { Button } from "@/components/ui/button";
import { Trash2, Zap, Moon, Sun, ArrowRightLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { getConversations, saveConversation, createConversation, clearAllConversations } from "@/lib/storage";
import Link from "next/link";
import { BookmarksSheet } from "@/components/chat/bookmarks-sheet";
import { ComparisonModal } from "@/components/chat/comparison-modal";
import { useComparison } from "@/lib/context/comparison-context";

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>("");
    const { theme, setTheme } = useTheme();
    const { selectedTools, setComparisonOpen } = useComparison();

    // Load conversation on mount
    useEffect(() => {
        const conversations = getConversations();
        if (conversations.length > 0) {
            const lastConv = conversations[0];
            setMessages(lastConv.messages);
            setConversationId(lastConv.id);
        } else {
            const newConv = createConversation();
            setConversationId(newConv.id);
        }
    }, []);

    // Save conversation on update
    useEffect(() => {
        if (conversationId && messages.length > 0) {
            saveConversation({
                id: conversationId,
                messages,
                title: messages[0].content.slice(0, 30) + "...",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
    }, [messages, conversationId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: input.trim(),
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedContent += chunk;
                }
            }

            let toolData: any = null;
            try {
                // Clean the content of markdown code blocks if present
                const cleanContent = accumulatedContent
                    .replace(/```json\s*/g, "")
                    .replace(/```\s*$/g, "")
                    .trim();

                toolData = JSON.parse(cleanContent);
            } catch (e) {
                console.error("Failed to parse JSON response", e);
                // If parsing fails, check if it looks like JSON but maybe incomplete
                if (accumulatedContent.trim().startsWith("{")) {
                    console.warn("JSON parsing failed but content looks like JSON. It might be incomplete.");
                }

                toolData = {
                    summary: accumulatedContent,
                    tools: { free: [], freemium: [], paid: [], openSource: [] },
                    recommendation: "",
                };
            }

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: toolData.summary || "Here are the results.",
                toolData: toolData,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, I encountered an error while researching. Please try again.",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            clearAllConversations();
            localStorage.removeItem("bq-conversations"); // Explicitly remove
            setMessages([]);
            const newConv = createConversation();
            setConversationId(newConv.id);
            window.location.reload(); // Force reload to clear any lingering state
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Zap className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="font-bold text-lg hidden md:block">BQ Tool Discovery</h1>
                </div>
                <div className="flex items-center gap-2">
                    <BookmarksSheet />
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearChat} className="text-xs">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Chat
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto relative scroll-smooth">
                <ChatList messages={messages} isLoading={isLoading} />
                <ChatInput
                    isLoading={isLoading}
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            </main>

            <ComparisonModal />
            {selectedTools.length > 0 && (
                <div className="fixed bottom-24 right-6 z-50">
                    <Button
                        size="lg"
                        className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-4"
                        onClick={() => setComparisonOpen(true)}
                    >
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Compare ({selectedTools.length})
                    </Button>
                </div>
            )}
        </div>
    );
}

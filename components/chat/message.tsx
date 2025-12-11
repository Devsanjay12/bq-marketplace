import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { ToolGrid } from "./tool-grid";
import { Bot, User } from "lucide-react";

interface MessageProps {
    message: Message;
}

export function ChatMessage({ message }: MessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex w-full gap-4 p-4 md:p-6",
                isUser ? "bg-background" : "bg-muted/30"
            )}
        >
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow">
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                    {/* 
            In a real app, we would use a markdown parser here.
            For MVP, we'll just render text, but if we have toolData, we render that specially.
          */}
                    {!message.toolData && (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    )}

                    {message.toolData && (
                        <div className="space-y-4">
                            {message.toolData.summary && (
                                <p className="font-medium text-lg">{message.toolData.summary}</p>
                            )}

                            <ToolGrid tools={message.toolData.tools} />

                            {message.toolData.recommendation && (
                                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                        🎯 Recommendation
                                    </h4>
                                    <p>{message.toolData.recommendation}</p>
                                </div>
                            )}

                            {message.toolData.suggested_followups && message.toolData.suggested_followups.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {message.toolData.suggested_followups.map((query, i) => (
                                        <button
                                            key={i}
                                            className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-xs font-medium transition-colors text-left"
                                            onClick={() => {
                                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                                const form = document.querySelector('form') as HTMLFormElement;
                                                if (textarea && form) {
                                                    textarea.value = query;
                                                    // Trigger input event for React state
                                                    const event = new Event('input', { bubbles: true });
                                                    textarea.dispatchEvent(event);
                                                    // Submit form
                                                    form.requestSubmit();
                                                }
                                            }}
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

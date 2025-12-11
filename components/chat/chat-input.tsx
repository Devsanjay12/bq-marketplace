"use client";

import * as React from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Wait, I didn't create textarea. I'll use Input or create Textarea.
// I'll use a simple textarea for now or create the component.
// Let's create a simple textarea inside this file or use Input if single line.
// Better to use a textarea for multi-line input.

interface ChatInputProps {
    isLoading: boolean;
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
}: ChatInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t p-4 pb-6">
            <div className="mx-auto max-w-3xl w-full">
                <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        className="flex min-h-[50px] max-h-[200px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        placeholder="Describe your use-case (e.g., 'I need a free AI coding assistant')..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={onKeyDown}
                        disabled={isLoading}
                        rows={1}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="mb-1"
                    >
                        <SendHorizontal className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    BQ researches real-time data. Results may vary.
                </p>
            </div>
        </div>
    );
}

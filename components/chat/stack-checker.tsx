"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Plus, AlertTriangle } from "lucide-react";

interface StackCheckerProps {
    tool: Tool;
}

export function StackChecker({ tool }: StackCheckerProps) {
    // In a real app, this would come from a global user context/store
    const [userStack, setUserStack] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    const worksWith = tool.compatibility?.works_with || [];
    const conflictsWith = tool.compatibility?.conflicts_with || [];

    const addTech = () => {
        if (inputValue && !userStack.includes(inputValue)) {
            setUserStack([...userStack, inputValue]);
            setInputValue("");
        }
    };

    const removeTech = (tech: string) => {
        setUserStack(userStack.filter((t) => t !== tech));
    };

    const getStatus = (tech: string) => {
        // Case insensitive check
        const techLower = tech.toLowerCase();
        const works = worksWith.some(t => t.toLowerCase() === techLower);
        const conflicts = conflictsWith.some(t => t.toLowerCase() === techLower);

        if (works) return "match";
        if (conflicts) return "conflict";
        return "neutral";
    };

    return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex gap-2">
                <Input
                    placeholder="Add your stack (e.g. React, Python)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTech()}
                    className="h-9"
                />
                <Button size="sm" onClick={addTech} variant="secondary">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[40px]">
                {userStack.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-2">
                        Add your tools to check compatibility...
                    </p>
                )}
                {userStack.map((tech) => {
                    const status = getStatus(tech);
                    return (
                        <Badge
                            key={tech}
                            variant="outline"
                            className={`
                                gap-1 pr-1
                                ${status === "match" ? "border-primary/50 bg-primary/10 text-primary" : ""}
                                ${status === "conflict" ? "border-destructive/50 bg-destructive/10 text-destructive" : ""}
                            `}
                        >
                            {status === "match" && <Check className="h-3 w-3" />}
                            {status === "conflict" && <AlertTriangle className="h-3 w-3" />}
                            {tech}
                            <button
                                onClick={() => removeTech(tech)}
                                className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    );
                })}
            </div>

            {/* Tool's Compatibility List */}
            <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Known Compatibility</p>
                <div className="flex flex-wrap gap-2">
                    {worksWith.map(tech => (
                        <Badge key={tech} variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                            <Check className="h-3 w-3 mr-1" /> Works with {tech}
                        </Badge>
                    ))}
                    {conflictsWith.map(tech => (
                        <Badge key={tech} variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                            <X className="h-3 w-3 mr-1" /> Conflicts with {tech}
                        </Badge>
                    ))}
                    {worksWith.length === 0 && conflictsWith.length === 0 && (
                        <span className="text-xs text-muted-foreground">No specific compatibility data available.</span>
                    )}
                </div>
            </div>
        </div>
    );
}

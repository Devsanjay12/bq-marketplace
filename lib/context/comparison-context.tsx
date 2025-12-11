"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Tool } from "@/types";

interface ComparisonContextType {
    selectedTools: Tool[];
    toggleTool: (tool: Tool) => void;
    isSelected: (tool: Tool) => boolean;
    clearSelection: () => void;
    isComparisonOpen: boolean;
    setComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
    const [isComparisonOpen, setComparisonOpen] = useState(false);

    const toggleTool = (tool: Tool) => {
        setSelectedTools((prev) => {
            const exists = prev.some((t) => t.name === tool.name);
            if (exists) {
                return prev.filter((t) => t.name !== tool.name);
            } else {
                if (prev.length >= 3) {
                    alert("You can compare up to 3 tools at a time.");
                    return prev;
                }
                return [...prev, tool];
            }
        });
    };

    const isSelected = (tool: Tool) => {
        return selectedTools.some((t) => t.name === tool.name);
    };

    const clearSelection = () => {
        setSelectedTools([]);
        setComparisonOpen(false);
    };

    return (
        <ComparisonContext.Provider
            value={{
                selectedTools,
                toggleTool,
                isSelected,
                clearSelection,
                isComparisonOpen,
                setComparisonOpen,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error("useComparison must be used within a ComparisonProvider");
    }
    return context;
}

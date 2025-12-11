import { useState } from "react";
import { ToolGroup } from "@/types";
import { ToolCard } from "./tool-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolGridProps {
    tools: ToolGroup;
}

type FilterType = "all" | "free" | "freemium" | "paid" | "opensource";

export function ToolGrid({ tools }: ToolGridProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const hasTools = (list: any[]) => list && list.length > 0;

    const showSection = (type: FilterType) => {
        if (activeFilter === "all") return true;
        return activeFilter === type;
    };

    const FilterButton = ({ type, label, count }: { type: FilterType, label: string, count: number }) => (
        <Button
            variant={activeFilter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(type)}
            className={cn(
                "rounded-full text-xs h-7 px-3",
                activeFilter === type ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            )}
            disabled={count === 0 && type !== "all"}
        >
            {label} <span className="ml-1 opacity-70 text-[10px]">({count})</span>
        </Button>
    );

    const totalCount = (tools.free?.length || 0) + (tools.freemium?.length || 0) + (tools.paid?.length || 0) + (tools.openSource?.length || 0);

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto mt-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 sticky top-0 z-10 bg-background/80 backdrop-blur-md p-2 -mx-2 rounded-lg border border-border/50 shadow-sm">
                <FilterButton type="all" label="All" count={totalCount} />
                <FilterButton type="free" label="Free" count={tools.free?.length || 0} />
                <FilterButton type="freemium" label="Freemium" count={tools.freemium?.length || 0} />
                <FilterButton type="paid" label="Paid" count={tools.paid?.length || 0} />
                <FilterButton type="opensource" label="Open Source" count={tools.openSource?.length || 0} />
            </div>

            {hasTools(tools.free) && showSection("free") && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Free Options
                    </h3>
                    <div className="grid gap-2">
                        {tools.free.map((tool, i) => (
                            <ToolCard key={i} tool={tool} />
                        ))}
                    </div>
                </section>
            )}

            {hasTools(tools.freemium) && showSection("freemium") && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <h3 className="text-sm font-bold text-amber-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Freemium
                    </h3>
                    <div className="grid gap-2">
                        {tools.freemium.map((tool, i) => (
                            <ToolCard key={i} tool={tool} />
                        ))}
                    </div>
                </section>
            )}

            {hasTools(tools.openSource) && showSection("opensource") && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <h3 className="text-sm font-bold text-teal-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                        Open Source
                    </h3>
                    <div className="grid gap-2">
                        {tools.openSource.map((tool, i) => (
                            <ToolCard key={i} tool={tool} />
                        ))}
                    </div>
                </section>
            )}

            {hasTools(tools.paid) && showSection("paid") && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <h3 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Paid Only
                    </h3>
                    <div className="grid gap-2">
                        {tools.paid.map((tool, i) => (
                            <ToolCard key={i} tool={tool} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

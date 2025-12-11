import { Tool } from "@/types";
import { ToolCard } from "./tool-card";

interface ToolGridProps {
    tools: Tool[];
    title?: string;
}

export function ToolGrid({ tools, title }: ToolGridProps) {
    return (
        <section className="py-6">
            {title && (
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <a href="#" className="text-sm text-primary hover:underline">See all</a>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </section>
    );
}

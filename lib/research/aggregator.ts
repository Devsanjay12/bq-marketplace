import { Tool } from "@/types";

export function aggregateResults(results: Tool[][]): Tool[] {
    const allTools = results.flat();
    const uniqueTools = new Map<string, Tool>();

    allTools.forEach((tool) => {
        // Normalize URL for deduplication
        const normalizedUrl = tool.websiteUrl.toLowerCase().replace(/\/$/, "");

        if (!uniqueTools.has(normalizedUrl)) {
            uniqueTools.set(normalizedUrl, tool);
        } else {
            // If duplicate, merge metadata or keep the better one
            // For now, we just keep the first one, but we could prioritize sources
            // e.g. GitHub > ProductHunt > Reddit > DuckDuckGo
            const existing = uniqueTools.get(normalizedUrl)!;

            // Prioritize GitHub description if available
            if (tool.source === "github" && existing.source !== "github") {
                uniqueTools.set(normalizedUrl, tool);
            }
        }
    });

    return Array.from(uniqueTools.values()).slice(0, 30); // Max 30 tools
}

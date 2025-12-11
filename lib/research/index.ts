import { Tool } from "@/types";
import { searchDuckDuckGo } from "./duckduckgo";
import { searchGitHub } from "./github";
import { searchReddit } from "./reddit";
import { scrapeProductHunt } from "./producthunt";
import { aggregateResults } from "./aggregator";

export async function researchTools(query: string): Promise<Tool[]> {
    console.log(`Starting research for: ${query}`);

    // Run all searches in parallel with a timeout
    const searchPromises = [
        searchDuckDuckGo(query),
        searchGitHub(query),
        searchReddit(query),
        scrapeProductHunt(),
    ];

    // Timeout wrapper
    const timeout = (ms: number) => new Promise<Tool[]>((resolve) => setTimeout(() => resolve([]), ms));

    try {
        const results = await Promise.all(
            searchPromises.map((p) => Promise.race([p, timeout(10000)])) // 10s timeout per source
        );

        const aggregated = aggregateResults(results);
        console.log(`Research complete. Found ${aggregated.length} tools.`);
        return aggregated;
    } catch (error) {
        console.error("Research orchestration error:", error);
        return [];
    }
}

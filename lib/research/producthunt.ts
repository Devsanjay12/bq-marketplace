import { Tool } from "@/types";

export async function scrapeProductHunt(): Promise<Tool[]> {
    // Disabled due to cheerio compatibility issues with Next.js
    // In production, use ProductHunt API instead
    console.log("ProductHunt scraping disabled");
    return [];
}


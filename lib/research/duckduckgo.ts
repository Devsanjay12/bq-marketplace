import { Tool } from "@/types";

export async function searchDuckDuckGo(query: string): Promise<Tool[]> {
    try {
        const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
        );

        if (!response.ok) {
            throw new Error("DuckDuckGo API failed");
        }

        const data = await response.json();
        const results: Tool[] = [];

        // Process Abstract
        if (data.AbstractURL && data.AbstractText) {
            results.push({
                id: "temp-" + Math.random().toString(36).substr(2, 9),
                slug: (data.Heading || query).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                name: data.Heading || query,
                company: "Unknown",
                description: data.AbstractText,
                shortDescription: data.AbstractText.slice(0, 100) + "...",
                category: "OTHER",
                pricingModel: "PAID",
                websiteUrl: data.AbstractURL,
                logo: "",
                verified: false,
                featured: false,
                trending: false,
                views: 0,
                clicks: 0,
                keyStrength: "Popular result",
                limitation: "Requires verification",
                pricingDetails: "Unknown",
                source: "duckduckgo",
            });
        }

        // Process Related Topics
        if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
            data.RelatedTopics.forEach((topic: any) => {
                if (topic.FirstURL && topic.Text) {
                    const parts = topic.Text.split(" - ");
                    const name = parts[0] || "Unknown Tool";
                    const description = parts.slice(1).join(" - ") || topic.Text;

                    results.push({
                        id: "temp-" + Math.random().toString(36).substr(2, 9),
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        name: name,
                        company: "Unknown",
                        description: description,
                        shortDescription: description.slice(0, 100) + "...",
                        category: "OTHER",
                        pricingModel: "PAID",
                        websiteUrl: topic.FirstURL,
                        logo: "",
                        verified: false,
                        featured: false,
                        trending: false,
                        views: 0,
                        clicks: 0,
                        keyStrength: "Related result",
                        limitation: "Requires verification",
                        pricingDetails: "Unknown",
                        source: "duckduckgo",
                    });
                }
            });
        }

        return results.slice(0, 5);
    } catch (error) {
        console.error("DuckDuckGo search error:", error);
        return [];
    }
}

import { Tool } from "@/types";

export async function searchReddit(query: string): Promise<Tool[]> {
    try {
        const subreddits = ["artificial", "LocalLLaMA", "SaaS", "SideProject"];
        const subredditString = subreddits.join("+");

        const response = await fetch(
            `https://www.reddit.com/r/${subredditString}/search.json?q=${encodeURIComponent(
                query
            )}&restrict_sr=on&sort=relevance&t=year&limit=5`,
            {
                headers: {
                    "User-Agent": "BQ-AI-Tool-Discovery/1.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Reddit API failed");
        }

        const data = await response.json();

        if (!data.data || !data.data.children) return [];

        return data.data.children.map((child: any) => {
            const post = child.data;
            return {
                id: "reddit-" + child.data.id,
                slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50),
                name: post.title.slice(0, 50) + (post.title.length > 50 ? "..." : ""),
                company: "Reddit Community",
                description: post.selftext ? post.selftext.slice(0, 150) + "..." : post.title,
                shortDescription: post.title.slice(0, 100),
                category: "OTHER",
                pricingModel: "PAID",
                websiteUrl: post.url,
                logo: "",
                verified: false,
                featured: false,
                trending: false,
                views: 0,
                clicks: 0,
                keyStrength: "Community Recommended",
                limitation: "Check comments for reviews",
                pricingDetails: "Unknown",
                source: "reddit",
                metadata: {
                    upvotes: post.ups,
                    lastUpdated: new Date(post.created_utc * 1000).toISOString(),
                },
            };
        });
    } catch (error) {
        console.error("Reddit search error:", error);
        return [];
    }
}

import { Tool } from "@/types";

export async function searchGitHub(query: string): Promise<Tool[]> {
    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(
                query
            )}+topic:ai&sort=stars&per_page=5`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "BQ-AI-Tool-Discovery",
                },
            }
        );

        if (!response.ok) {
            if (response.status === 403) {
                console.warn("GitHub API rate limit exceeded");
                return [];
            }
            throw new Error("GitHub API failed");
        }

        const data = await response.json();

        if (!data.items) return [];

        return data.items.map((repo: any) => ({
            id: "github-" + repo.id,
            slug: repo.name.toLowerCase(),
            name: repo.name,
            company: repo.owner?.login || "GitHub",
            description: repo.description || "No description available",
            shortDescription: (repo.description || "No description available").slice(0, 100) + "...",
            category: "CODING",
            pricingModel: "OPENSOURCE",
            websiteUrl: repo.html_url,
            logo: repo.owner?.avatar_url || "",
            verified: false,
            featured: false,
            trending: false,
            views: 0,
            clicks: 0,
            keyStrength: "Open Source Code",
            limitation: "Requires self-hosting or technical knowledge",
            pricingDetails: "Free (MIT/Apache)",
            source: "github",
            metadata: {
                stars: repo.stargazers_count,
                lastUpdated: repo.updated_at,
            },
        }));
    } catch (error) {
        console.error("GitHub search error:", error);
        return [];
    }
}

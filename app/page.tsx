import { prisma } from "@/lib/db/prisma";
import { HeroSection } from "@/components/marketplace/hero-section";
import { CategoryList } from "@/components/marketplace/category-list";
import { ToolGrid } from "@/components/marketplace/tool-grid";
import { Header } from "@/components/shared/header";

export const dynamic = "force-dynamic";

export default async function Home() {
    const featuredTools = await prisma.tool.findMany({
        where: { featured: true },
        take: 4,
    });

    const trendingTools = await prisma.tool.findMany({
        where: { trending: true },
        take: 4,
    });

    const newTools = await prisma.tool.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroSection />

                <div className="container px-4 md:px-6 space-y-12 pb-20">
                    <CategoryList />

                    <ToolGrid title="Featured Tools" tools={featuredTools} />

                    <ToolGrid title="Trending This Week" tools={trendingTools} />

                    <ToolGrid title="New Arrivals" tools={newTools} />
                </div>
            </main>
        </div>
    );
}

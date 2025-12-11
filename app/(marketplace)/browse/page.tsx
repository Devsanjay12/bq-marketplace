import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/shared/header";
import { ToolCard } from "@/components/marketplace/tool-card";

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {
    const search = searchParams.search;

    const tools = await prisma.tool.findMany({
        where: {
            verified: true,
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                        { shortDescription: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Browse All Tools</h1>
                    <p className="text-muted-foreground">
                        Discover the latest and greatest AI tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool: any) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </main>
        </div>
    );
}

import { prisma } from "@/lib/db/prisma";
import { ToolGrid } from "@/components/marketplace/tool-grid";
import { Header } from "@/components/shared/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchPageProps {
    searchParams: {
        q?: string;
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";

    const tools = query ? await prisma.tool.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { category: { equals: query as any } }, // Simple exact match for category
            ],
        },
    }) : [];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <div className="max-w-xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold text-center mb-6">Search Tools</h1>
                    <form action="/search" className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Search for tools..."
                            className="pl-10 h-12 rounded-full"
                        />
                    </form>
                </div>

                {query && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            {tools.length} results for "{query}"
                        </h2>
                    </div>
                )}

                <ToolGrid tools={tools as any} />

                {!query && (
                    <div className="text-center text-muted-foreground mt-12">
                        Enter a search term to find AI tools.
                    </div>
                )}
            </main>
        </div>
    );
}

import { prisma } from "@/lib/db/prisma";
import { ToolGrid } from "@/components/marketplace/tool-grid";
import { Header } from "@/components/shared/header";
import { notFound } from "next/navigation";
import { Category } from "@prisma/client";

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const categoryEnum = params.slug.toUpperCase() as Category;

    // Validate category
    if (!Object.values(Category).includes(categoryEnum)) {
        // Handle "all" or invalid categories
        if (params.slug !== "all") {
            // return notFound(); // For now, let's just show all if invalid or handle gracefully
        }
    }

    const tools = await prisma.tool.findMany({
        where: params.slug !== "all" ? {
            category: categoryEnum,
        } : undefined,
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-8 capitalize">{params.slug} Tools</h1>
                <ToolGrid tools={tools} />
            </main>
        </div>
    );
}

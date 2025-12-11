import { Header } from "@/components/shared/header";
import { CategoryList } from "@/components/marketplace/category-list";

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Categories</h1>
                    <p className="text-muted-foreground">
                        Browse AI tools by category.
                    </p>
                </div>
                <CategoryList />
            </main>
        </div>
    );
}

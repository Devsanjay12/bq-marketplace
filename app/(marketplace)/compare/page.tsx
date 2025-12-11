import { Header } from "@/components/shared/header";

export const dynamic = 'force-dynamic';

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Compare Tools</h1>
                <div className="p-12 text-center border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">
                        Select tools to compare them side-by-side. (Feature coming soon)
                    </p>
                </div>
            </main>
        </div>
    );
}

import { Header } from "@/components/shared/header";
import { ToolForm } from "@/components/vendor/tool-form";

export const dynamic = 'force-dynamic';

export default function ListToolPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6">
                <ToolForm />
            </main>
        </div>
    );
}

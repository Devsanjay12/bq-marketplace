import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/header";
import { ToolCard } from "@/components/marketplace/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user data including submitted tools
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            tools: true,
        },
    });

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Profile</h1>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={user.name || ""} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email || ""} disabled />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">My Tools</h2>
                        {user.tools.length === 0 ? (
                            <p className="text-muted-foreground">You haven't submitted any tools yet.</p>
                        ) : (
                            <div className="grid gap-4">
                                {user.tools.map((tool) => (
                                    <ToolCard key={tool.id} tool={tool as any} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

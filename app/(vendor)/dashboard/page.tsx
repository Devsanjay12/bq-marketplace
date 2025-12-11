import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Eye, MousePointer2 } from "lucide-react";
import Link from "next/link";

export default async function VendorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch tools owned by user
    const tools = await prisma.tool.findMany({
        where: { vendorId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    const totalViews = tools.reduce((acc, tool) => acc + tool.views, 0);
    const totalClicks = tools.reduce((acc, tool) => acc + tool.clicks, 0);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
                    <Link href="/list-tool">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> List New Tool
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tools.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalViews}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalClicks}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tools List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Tools</h2>
                    {tools.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/50">
                            <p className="text-muted-foreground mb-4">You haven't listed any tools yet.</p>
                            <Link href="/list-tool">
                                <Button variant="outline">List your first tool</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tools.map((tool) => (
                                <Card key={tool.id} className="flex items-center p-4 justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden relative">
                                            <img src={tool.logo} alt={tool.name} className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{tool.name}</h3>
                                            <p className="text-sm text-muted-foreground">{tool.views} views • {tool.clicks} clicks</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

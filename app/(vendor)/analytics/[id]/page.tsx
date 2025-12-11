import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/shared/header";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsPageProps {
    params: {
        id: string;
    };
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const tool = await prisma.tool.findUnique({
        where: { id: params.id },
        include: {
            analytics: {
                orderBy: {
                    date: 'desc'
                },
                take: 30
            }
        }
    });

    if (!tool) {
        return <div>Tool not found</div>;
    }

    if (tool.vendorId !== session.user.id) {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Analytics for {tool.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{tool.views}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Clicks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{tool.clicks}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tool.analytics.map((entry: any) => (
                                <div key={entry.id} className="flex justify-between border-b pb-2">
                                    <span>{entry.date.toLocaleDateString()}</span>
                                    <span>{entry.views} views</span>
                                    <span>{entry.clicks} clicks</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

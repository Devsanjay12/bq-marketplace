import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/shared/header";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default async function UserReviewsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const reviews = await prisma.review.findMany({
        where: { userId: session.user.id },
        include: {
            tool: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">You haven't written any reviews yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((review: any) => (
                            <Card key={review.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{review.tool.name}</span>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{review.comment}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Globe, Github, CheckCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROICalculator } from "@/components/chat/roi-calculator";
import { StackChecker } from "@/components/chat/stack-checker";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { BookmarkButton } from "@/components/marketplace/bookmark-button";
import { Tool } from "@/types";

interface ToolPageProps {
    params: {
        id: string;
    };
}

export default async function ToolPage({ params }: ToolPageProps) {
    const tool = await prisma.tool.findUnique({
        where: { id: params.id },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!tool) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 md:px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border bg-muted shrink-0">
                        <Image
                            src={tool.logo || "/placeholder-logo.png"}
                            alt={tool.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <span className="font-medium text-foreground">{tool.company}</span>
                            <span>•</span>
                            <span className="flex items-center text-amber-500">
                                4.8 <Star className="w-4 h-4 fill-current ml-1" />
                            </span>
                            <span>•</span>
                            <span>{tool.pricingModel}</span>
                        </div>
                        <div className="flex gap-3">
                            <Button asChild>
                                <Link href={tool.websiteUrl} target="_blank">
                                    Visit Website <Globe className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            {tool.githubUrl && (
                                <Button variant="outline" asChild>
                                    <Link href={tool.githubUrl} target="_blank">
                                        GitHub <Github className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            )}
                            <BookmarkButton tool={tool as unknown as Tool} />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-4">About this tool</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {tool.description}
                            </p>
                        </section>

                        {/* Features */}
                        {tool.features && (
                            <section>
                                <h2 className="text-xl font-bold mb-4">Key Features</h2>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {(tool.features as string[]).map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Limitations */}
                        {tool.limitations && (
                            <section>
                                <h2 className="text-xl font-bold mb-4">Limitations</h2>
                                <ul className="space-y-2">
                                    {(tool.limitations as string[]).map((limitation, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                            <span className="text-muted-foreground">{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Advanced Features */}
                        <section>
                            <h2 className="text-xl font-bold mb-4">Advanced Tools</h2>
                            <Tabs defaultValue="roi" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
                                    <TabsTrigger value="stack">Stack Checker</TabsTrigger>
                                </TabsList>
                                <TabsContent value="roi">
                                    <ROICalculator tool={tool as unknown as Tool} />
                                </TabsContent>
                                <TabsContent value="stack">
                                    <StackChecker tool={tool as unknown as Tool} />
                                </TabsContent>
                            </Tabs>
                        </section>

                        {/* Reviews */}
                        <section>
                            <h2 className="text-xl font-bold mb-4">Reviews</h2>
                            <ReviewForm toolId={tool.id} />
                            <ReviewList reviews={tool.reviews} />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing */}
                        <div className="border rounded-lg p-6">
                            <h3 className="font-bold mb-4">Pricing</h3>
                            <Badge className="mb-4">{tool.pricingModel}</Badge>
                            {tool.pricingDetails && (
                                <div className="text-sm text-muted-foreground">
                                    {JSON.stringify(tool.pricingDetails)}
                                </div>
                            )}
                        </div>

                        {/* Category */}
                        <div className="border rounded-lg p-6">
                            <h3 className="font-bold mb-4">Category</h3>
                            <Badge variant="secondary">{tool.category}</Badge>
                        </div>

                        {/* Stats */}
                        <div className="border rounded-lg p-6">
                            <h3 className="font-bold mb-4">Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Views</span>
                                    <span className="font-medium">{tool.views}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Clicks</span>
                                    <span className="font-medium">{tool.clicks}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

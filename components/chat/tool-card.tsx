"use client";

import { useState } from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookmarks } from "@/lib/context/bookmarks-context";
import { ChevronDown, ChevronUp, ExternalLink, Star, ThumbsUp, Zap, AlertTriangle, DollarSign, Layers, BookOpen, Bookmark, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROICalculator } from "./roi-calculator";
import { StackChecker } from "./stack-checker";
import { cn } from "@/lib/utils";
import { useComparison } from "@/lib/context/comparison-context";
import { Checkbox } from "@/components/ui/checkbox";

interface ToolCardProps {
    tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const { toggleTool, isSelected } = useComparison();
    const bookmarked = isBookmarked(tool);
    const selected = isSelected(tool);

    const getBadgeColor = (model: string) => {
        switch (model) {
            case "free": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "freemium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "paid": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "opensource": return "bg-teal-500/10 text-teal-500 border-teal-500/20";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

    const getBorderColor = (model: string) => {
        switch (model) {
            case "free": return "#10B981";
            case "freemium": return "#F59E0B";
            case "paid": return "#8B5CF6";
            case "opensource": return "#14B8A6";
            default: return "#94A3B8";
        }
    };

    return (
        <Card className="w-full mb-4 overflow-hidden border-l-4 transition-all hover:shadow-lg bg-card/50 backdrop-blur-sm" style={{ borderLeftColor: getBorderColor(tool.pricingModel) }}>
            <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selected}
                                    onCheckedChange={() => toggleTool(tool)}
                                    className="mr-2 h-4 w-4 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                            </div>
                            <CardTitle className="text-xl font-display font-bold tracking-tight hover:underline">
                                {tool.internalUrl ? (
                                    <Link href={tool.internalUrl}>{tool.name}</Link>
                                ) : (
                                    tool.name
                                )}
                            </CardTitle>
                            <Badge className={getBadgeColor(tool.pricingModel || "paid")} variant="outline">
                                {(tool.pricingModel || "paid").toUpperCase()}
                            </Badge>
                            {tool.freshness === "new" && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] px-1.5 py-0">NEW</Badge>
                            )}
                            {tool.freshness === "trending" && (
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px] px-1.5 py-0">TRENDING</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 font-light">{tool.description}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary", bookmarked && "text-primary fill-primary")}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(tool);
                            }}
                        >
                            <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
                        </Button>
                        <Button variant="ghost" size="sm" className="ml-1 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CardContent className="p-0">
                            <Tabs defaultValue="overview" className="w-full">
                                <div className="px-4 border-b border-border bg-muted/20">
                                    <TabsList className="h-9 bg-transparent p-0 w-full justify-start gap-4">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 pb-2 text-xs uppercase tracking-wider">Overview</TabsTrigger>
                                        <TabsTrigger value="roi" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 pb-2 text-xs uppercase tracking-wider">ROI Calc</TabsTrigger>
                                        <TabsTrigger value="fit" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 pb-2 text-xs uppercase tracking-wider">Stack Fit</TabsTrigger>
                                        <TabsTrigger value="learn" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 pb-2 text-xs uppercase tracking-wider">Learn</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="p-4 bg-background/50">
                                    <TabsContent value="overview" className="mt-0 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                                                <span className="flex items-center gap-2 font-semibold text-xs uppercase text-primary mb-1">
                                                    <Zap className="h-3 w-3" /> Key Strength
                                                </span>
                                                <p className="text-sm">{tool.keyStrength}</p>
                                            </div>
                                            <div className="bg-destructive/5 p-3 rounded-md border border-destructive/10">
                                                <span className="flex items-center gap-2 font-semibold text-xs uppercase text-destructive mb-1">
                                                    <AlertTriangle className="h-3 w-3" /> Limitation
                                                </span>
                                                <p className="text-sm">{tool.limitation}</p>
                                            </div>
                                        </div>

                                        import Link from "next/link"; // Add this import at top

                                        // ... inside component ...

                                        <div className="text-xs text-muted-foreground flex gap-3">
                                            {tool.metadata?.stars && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {tool.metadata.stars.toLocaleString()}
                                                </span>
                                            )}
                                            {tool.metadata?.upvotes && (
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3 text-orange-500" /> {tool.metadata.upvotes.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {tool.internalUrl && (
                                                <Button size="sm" variant="secondary" className="gap-2 h-8" asChild>
                                                    <Link href={tool.internalUrl}>
                                                        View Details <ArrowRightLeft className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {tool.websiteUrl && tool.websiteUrl !== "undefined" ? (
                                                <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-8" asChild>
                                                    <a href={tool.websiteUrl.startsWith('http') ? tool.websiteUrl : `https://${tool.websiteUrl}`} target="_blank" rel="noopener noreferrer">
                                                        Visit Website <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                            ) : null}
                                        </div>
                                        <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                                            <span className="font-semibold text-foreground">Pricing:</span> {typeof tool.pricingDetails === 'string' ? tool.pricingDetails : JSON.stringify(tool.pricingDetails)}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="roi" className="mt-0">
                                        <ROICalculator tool={tool} />
                                    </TabsContent>

                                    <TabsContent value="fit" className="mt-0">
                                        <StackChecker tool={tool} />
                                    </TabsContent>

                                    <TabsContent value="learn" className="mt-0">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold">Learning Resources</h4>
                                                <Badge variant="outline" className="text-[10px] uppercase">
                                                    {tool.learning?.difficulty || "Beginner"} Friendly
                                                </Badge>
                                            </div>
                                            {tool.learning?.resources && tool.learning.resources.length > 0 ? (
                                                <div className="grid gap-2">
                                                    {tool.learning.resources.map((res: any, i: number) => (
                                                        <a
                                                            key={i}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-full bg-background border border-border group-hover:border-primary/50 transition-colors">
                                                                    {res.type === 'video' ? <Layers className="h-4 w-4 text-blue-400" /> : <BookOpen className="h-4 w-4 text-emerald-400" />}
                                                                </div>
                                                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{res.title}</span>
                                                            </div>
                                                            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground text-sm italic">
                                                    No specific learning resources found for this tool yet.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

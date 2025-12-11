"use client";

import { Tool } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ToolCardProps {
    tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-card">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-muted">
                            <Image
                                src={tool.logo || "/placeholder-logo.png"}
                                alt={tool.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="mb-2">
                        <h3 className="font-bold text-lg leading-tight mb-1 truncate">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{tool.company}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center text-amber-500 text-xs font-medium">
                            <span className="mr-1">4.8</span>
                            <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{tool.views} views</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                            {tool.category}
                        </Badge>
                        <Badge variant={tool.pricingModel === "FREE" ? "default" : "outline"} className="text-[10px] px-1.5 h-5">
                            {tool.pricingModel}
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Link href={`/tool/${tool.id}`} className="w-full">
                        <Button className="w-full h-8 text-xs" variant="secondary">
                            View Details
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

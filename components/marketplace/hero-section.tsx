"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-background py-12 sm:py-20 lg:py-24">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-6"
                    >
                        The App Store for AI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground mb-8"
                    >
                        Discover, compare, and master the best AI tools and SaaS applications.
                        Curated, verified, and community-reviewed.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search for tools (e.g. 'coding assistant', 'video generator')..."
                                className="pl-10 h-12 rounded-full shadow-lg border-primary/20 focus-visible:ring-primary"
                            />
                            <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-10 px-6">
                                Search
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground"
                    >
                        <span>🔥 Trending:</span>
                        <span className="hover:text-primary cursor-pointer">Cursor</span>
                        <span className="hover:text-primary cursor-pointer">Midjourney</span>
                        <span className="hover:text-primary cursor-pointer">AutoGPT</span>
                    </motion.div>
                </div>
            </div>

            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>
        </div>
    );
}

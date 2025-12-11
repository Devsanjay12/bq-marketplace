"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    shimmerColor?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
    ({ children, className, shimmerColor = "#ffffff", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-none border border-primary bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(189,255,0,0.5)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    className
                )}
                {...props}
            >
                <div
                    className="absolute inset-0 -translate-x-[100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider">
                    {children}
                </span>
            </button>
        );
    }
);

ShimmerButton.displayName = "ShimmerButton";

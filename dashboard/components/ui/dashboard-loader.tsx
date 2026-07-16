"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLoaderProps {
    message?: string;
    className?: string;
}

export function DashboardLoader({
                                    message = "Verifying session…",
                                    className,
                                }: DashboardLoaderProps) {
    const [dots, setDots] = useState("");

    // Subtle animated ellipsis for feedback during longer loads
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 transition-all duration-300",
                className
            )}
        >
            <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
                {/* Animated Custom Ring & Core Icon */}
                <div className="relative flex items-center justify-center h-16 w-16">
                    {/* Outer Pulsing Aura */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping opacity-75" />

                    {/* Outer Spinning Ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin" />

                    {/* Inner Brand/App Symbol (Hexagon/Diamond) */}
                    <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center rotate-45 transition-transform">
                        <div className="h-2.5 w-2.5 rounded-sm bg-primary -rotate-45" />
                    </div>
                </div>

                {/* Status Message & Subtle Progress Bar */}
                <div className="space-y-3 w-full">
                    <p className="text-sm font-medium text-muted-foreground font-sans tracking-tight">
                        {message}
                        <span className="inline-block w-4 text-left font-mono">{dots}</span>
                    </p>

                    {/* Indeterminate Skeleton Bar */}
                    <div className="h-1 w-32 mx-auto rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary/70 rounded-full w-1/2 animate-[shimmer_1.5s_infinite_linear] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
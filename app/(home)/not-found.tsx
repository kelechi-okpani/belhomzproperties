import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] mt-28 pt-28 flex flex-col items-center justify-center px-4 text-center">
            {/* Visual Icon Header */}
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
                <div className="relative h-20 w-20 rounded-full bg-card border border-border/80 flex items-center justify-center text-primary shadow-sm">
                    <Compass className="h-10 w-10 animate-spin-slow" />
                </div>
            </div>

            {/* 404 Header Text */}
            <div className="space-y-3 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Error 404
        </span>
                <h1 className="text-4xl font-extrabold tracking-tight font-display sm:text-5xl text-foreground">
                    Off the Market
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    It looks like the page or listing you are looking for has been sold, removed, or never existed in our database. Let's get you back on track.
                </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
                <Link href="/properties">
                    <Button variant="default" className="w-full gap-2 shadow-sm hover:shadow transition">
                        Explore Properties
                    </Button>
                </Link>

                <Link href="/public">
                    <Button variant="outline" className="w-full gap-2 border-border/80 hover:bg-muted transition">
                        <ArrowLeft className="h-4 w-4" /> Go Home
                    </Button>
                </Link>
            </div>

            {/* Decorative Blueprint Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
    )
}
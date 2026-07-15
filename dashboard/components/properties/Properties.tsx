"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Plus, Search, SlidersHorizontal, Home } from "lucide-react";
import { PROPERTIES_QUERY } from "@/dashboard/lib/graphql/documents";
import { PropertyCard } from "@/dashboard/components/properties/property-card";
import { Button } from "@/dashboard/components/ui/button";
import { Input } from "@/dashboard/components/ui/input";
import { Can } from "@/dashboard/components/auth/can";

const STATUS_TABS = ["ALL", "AVAILABLE", "RESERVED", "SOLD"] as const;

interface PropertiesPageProps {
    variant?: "dashboard" | "public";
}

export default function Properties({ variant = "dashboard" }: PropertiesPageProps) {
    const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>("ALL");
    const [search, setSearch] = useState("");

    const { data, loading } = useQuery<any>(PROPERTIES_QUERY, {
        variables: {
            filter: {
                ...(status !== "ALL" ? { status } : {}),
                ...(search ? { search } : {}),
                limit: 50,
            },
        },
    });

    const properties = data?.properties?.items ?? [];
    const isDashboard = variant === "dashboard";

    return (
        <div className={`space-y-8 ${!isDashboard ? "container mx-auto px-4 py-8 max-w-7xl" : ""}`}>
            {/* Header Section */}
            <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
                        {isDashboard ? "Manage Properties" : "Explore Featured Properties"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isDashboard
                            ? "View, filter, and modify your real estate listings."
                            : "Find your dream space from our handpicked luxury collection."}
                    </p>
                </div>

                {/* Render Add button on Dashboard, or only if authorized */}
                {isDashboard && (
                    <Can do="manageProperties">
                        <Link href="/account/property/new">
                            <Button variant="brass" className="cursor-pointer shadow-sm text-white bg-foreground font-bold hover:text-foreground transition duration-200">
                                <Plus className="h-4 w-4 mr-1.5" />
                                Add property
                            </Button>
                        </Link>
                    </Can>
                )}
            </div>

            {/* Filter and Search Bar Card */}
            <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
                {/* Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {STATUS_TABS.map((tab) => {
                        const isActive = status === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setStatus(tab)}
                                className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm scale-102"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {tab === "ALL" ? "All Statuses" : tab.toLowerCase()}
                            </button>
                        );
                    })}
                </div>

                {/* Search Input and Auxiliary Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                        <Input
                            placeholder="Search by area, type, title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 w-full border-border/80 focus-visible:ring-primary/20 transition duration-200 bg-background"
                        />
                    </div>

                    <Button variant="outline" size="lg" className="h-10 w-10 border-border/80 shrink-0 md:flex" aria-label="More Filters">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Reels Grid View (Responsive layout customized for vertical aspect ratios) */}
            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
            ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 py-16 px-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                        <Home className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No matches found</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                        We couldn't find any properties fitting your criteria. Try adjusting your search query or status filter.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => { setStatus("ALL"); setSearch(""); }} className="mt-4">
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {properties.map((property: any) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            isAdmin={isDashboard}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PropertyCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card animate-pulse shadow-sm aspect-[9/14] flex flex-col justify-end p-4 space-y-4">
            <div className="space-y-2">
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
            <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded" />
            </div>
        </div>
    );
}
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

export const STATUS_TABS = ["ALL", "AVAILABLE", "RESERVED", "SOLD"] as const;

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
        <div className={`space-y-6 sm:space-y-8 ${!isDashboard ? "container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl" : ""}`}>
            {/* Header Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className='w-full'>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                        {isDashboard ? "Manage Properties" : "Explore Featured Properties"}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {isDashboard
                            ? "View, filter, and modify your real estate listings."
                            : "Find your dream space from our handpicked luxury collection."}
                    </p>
                </div>

                   <div>
                       {isDashboard && (
                           <Can do="manageProperties">
                               <Link href="/account/property/new" className="w-full sm:w-auto">
                                   <Button variant="brass" className="w--[4rem] sm:w-auto cursor-pointer shadow-sm text-primary-foreground bg-primary font-bold hover:bg-primary/90 transition duration-200">
                                       <Plus className="h-4 w-4 mr-1.5" />
                                       Add property
                                   </Button>
                               </Link>
                           </Can>
                       )}
                   </div>
            </div>

            {/* Filter and Search Bar Card */}
            <div className="bg-card border border-border rounded-xl p-3 sm:p-4 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0 lg:pb-0 scrollbar-none -mx-1 px-1">
                    {STATUS_TABS.map((tab) => {
                        const isActive = status === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setStatus(tab)}
                                className={`cursor-pointer rounded-lg sm:px-4 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm px-4 "
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {tab === "ALL" ? "All Statuses" : tab.toLowerCase()}
                            </button>
                        );
                    })}
                </div>

                {/* Search Input and Auxiliary Filters */}
                {/*<div className="flex items-center gap-2.5 w-full lg:w-auto">*/}
                {/*    <div className="relative flex-1 lg:w-72">*/}
                {/*        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />*/}
                {/*        <Input*/}
                {/*            placeholder="Search by area, type, title..."*/}
                {/*            value={search}*/}
                {/*            onChange={(e) => setSearch(e.target.value)}*/}
                {/*            className="pl-9 h-10 w-full border-border bg-background focus-visible:ring-primary/20 text-sm"*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*    <Button variant="outline" size="lg" className="h-10 w-10 border-border shrink-0" aria-label="More Filters">*/}
                {/*        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>

            {/* Grid View */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(8)].map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
            ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 sm:py-16 px-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                        <Home className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">No matches found</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm">
                        We couldn't find any properties fitting your criteria. Try adjusting your search query or status filter.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => { setStatus("ALL"); setSearch(""); }} className="mt-4">
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
        <div className="rounded-2xl border border-border overflow-hidden bg-card animate-pulse shadow-sm flex flex-col">
            <div className="aspect-[4/3] bg-muted w-full" />
            <div className="p-4 space-y-3">
                <div className="h-5 w-1/2 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="pt-3 border-t border-border flex justify-between items-center">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}
"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, MapPin, Ruler, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { PROPERTY_DETAIL_QUERY, UPDATE_PROPERTY_STATUS_MUTATION } from "@/dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/dashboard/components/auth/can";

const STATUS_TONE = {
    AVAILABLE: "secondary",
    RESERVED: "outline",
    SOLD: "destructive",
} as const;

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount ?? 0);
}

interface PropertyDetailPageProps {
    params: Promise<{ id: string }>;
    variant?: "dashboard" | "public";
}

export default function PropertyDetails({ params, variant = "public" }: PropertyDetailPageProps) {
    const { id } = use(params);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const { data, loading, refetch } = useQuery<any>(PROPERTY_DETAIL_QUERY, {
        variables: { propertyId: id },
        skip: !id
    });

    const [updateStatus, { loading: updating }] = useMutation<any>(UPDATE_PROPERTY_STATUS_MUTATION);

    const isDashboard = variant === "dashboard";
    const backLink = isDashboard ? "/dashboard/properties" : "/properties";

    if (loading) {
        return (
            <div className={`space-y-6 animate-pulse ${!isDashboard ? "container mx-auto px-4 py-8 max-w-6xl" : "max-w-5xl"}`}>
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-6 h-[450px] bg-muted rounded-xl animate-pulse" />
                    <div className="lg:col-span-6 h-[450px] bg-muted rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    const property = data?.property;
    if (!property) {
        return (
            <div className={`space-y-6 ${!isDashboard ? "container mx-auto px-4 py-8 max-w-6xl" : "max-w-5xl"}`}>
                <Link href={backLink} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to properties
                </Link>
                <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
                    Property not found or has been removed.
                </div>
            </div>
        );
    }

    const handleStatusChange = async (status: string) => {
        try {
            await updateStatus({
                variables: {
                    updatePropertyStatusId: id,
                    status
                }
            });
            refetch();
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const images = property.images ?? [];

    return (
        <div className={`space-y-6 animate-in fade-in duration-300 ${!isDashboard ? "container mx-auto px-4 py-8 max-w-6xl" : "max-w-5xl"}`}>
            <Link
                href={backLink}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to properties
            </Link>

            {/* Side-by-Side Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Left Column: Image Gallery (Takes 5 cols on large screens to keep portrait ratio elegant) */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-border shadow-sm flex items-center justify-center">
                        {images.length > 0 ? (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images[activeImageIndex].url}
                                    alt={`${property.title} - View ${activeImageIndex + 1}`}
                                    className="h-full w-full object-contain transition-all duration-300"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition backdrop-blur-sm"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition backdrop-blur-sm"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider backdrop-blur-sm">
                                            {activeImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No image uploaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details & Description (Takes 7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                    <Card className="border border-border/80 shadow-sm rounded-2xl h-full flex flex-col">
                        <CardContent className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Badge variant={STATUS_TONE[property.status as keyof typeof STATUS_TONE] ?? "default"} className="px-3 py-0.5">
                                        {property.status}
                                    </Badge>
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                        {property.title}
                                    </h1>
                                    <p className="font-display text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-500">
                                        {formatCurrency(property.price)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-y border-border/60 py-4">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-primary/80" /> {property.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Ruler className="h-4 w-4 text-primary/80" /> {property.size} m²
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Home className="h-4 w-4 text-primary/80" /> {property.type}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium text-foreground text-base">Description</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                        {property.description}
                                    </p>
                                </div>

                                {property.amenities?.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-foreground text-base">Amenities & Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {property.amenities.map((a: string) => (
                                                <Badge key={a} variant="secondary" className="px-3 py-1 text-xs">
                                                    {a}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Optional status editing actions pinned to bottom */}
                            {isDashboard && (
                                <Can do="manageProperties">
                                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border/60 pt-6">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Mark Property Status:
                                        </span>
                                        <div className="flex gap-2">
                                            {["AVAILABLE", "RESERVED", "SOLD"].map((s) => (
                                                <Button
                                                    key={s}
                                                    variant={s === property.status ? "secondary" : "outline"}
                                                    size="sm"
                                                    disabled={updating || s === property.status}
                                                    onClick={() => handleStatusChange(s)}
                                                >
                                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </Can>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
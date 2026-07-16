"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    ArrowLeft,
    MapPin,
    Ruler,
    Home,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Loader2,
    X
} from "lucide-react";
import {
    PROPERTY_DETAIL_QUERY,
    UPDATE_PROPERTY_STATUS_MUTATION,
    DELETE_PROPERTY_MUTATION
} from "@/dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/dashboard/components/auth/can";
import { useToast } from "@/components/ui/use-toast";
import EditProperty from "./EditProperty"; // Adjust path if needed

const STATUS_TONE = {
    AVAILABLE: "default",
    RESERVED: "secondary",
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
    const router = useRouter();
    const { toast } = useToast();

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, loading, refetch } = useQuery<any>(PROPERTY_DETAIL_QUERY, {
        variables: { propertyId: id },
        skip: !id,
    });

    const [updateStatus, { loading: updating }] = useMutation<any>(UPDATE_PROPERTY_STATUS_MUTATION);
    const [deleteProperty, { loading: deleting }] = useMutation<any>(DELETE_PROPERTY_MUTATION);

    const isDashboard = variant === "dashboard";
    const backLink = isDashboard ? "/account/property" : "/properties";

    if (loading) {
        return (
            <div className={`space-y-6 ${!isDashboard ? "container mx-auto px-4 py-8 max-w-6xl" : "max-w-5xl"}`}>
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    <div className="lg:col-span-5 aspect-[4/3] lg:aspect-[3/4] bg-muted rounded-2xl animate-pulse" />
                    <div className="lg:col-span-7 h-[400px] bg-muted rounded-2xl animate-pulse" />
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
                <div className="border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
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
                    status,
                },
            });
            toast({
                title: "Status updated",
                description: `Property status changed to ${status.toLowerCase()}.`,
            });
            refetch();
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: err?.message || "Failed to update property status.",
            });
        }
    };

    const handleDeleteProperty = async () => {
        try {
            await deleteProperty({
                variables: {
                    deletePropertyId: id,
                },
            });
            toast({
                title: "Property deleted",
                description: `"${property.title}" has been permanently removed.`,
            });
            setIsDeleteModalOpen(false);
            router.push(backLink);
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Deletion failed",
                description: err?.message || "Could not delete this property.",
            });
        }
    };

    const images = property.images ?? [];

    return (
        <div className={`space-y-6 ${!isDashboard ? "container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl" : "max-w-5xl"}`}>
            <div className="flex items-center justify-between">
                <Link
                    href={backLink}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to properties
                </Link>

                {/* Dashboard Controls: Edit & Delete */}
                {isDashboard && (
                    <Can do="manageProperties">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditModalOpen(true)}
                                className="gap-1.5 text-xs font-semibold"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="gap-1.5 text-xs font-semibold"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                        </div>
                    </Can>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Image Frame */}
                <div className="lg:col-span-5 w-full">
                    <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted border border-border shadow-sm flex items-center justify-center">
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[activeImageIndex]?.url}
                                    alt={`${property.title} - View ${activeImageIndex + 1}`}
                                    className="h-full w-full object-cover transition-all duration-300"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition backdrop-blur-sm"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition backdrop-blur-sm"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider backdrop-blur-sm">
                                            {activeImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="text-muted-foreground text-sm font-medium">
                                No image uploaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                    <Card className="border border-border shadow-sm rounded-2xl bg-card">
                        <CardContent className="p-5 sm:p-8 space-y-6">
                            <div className="space-y-3">
                                <Badge variant={STATUS_TONE[property.status as keyof typeof STATUS_TONE] ?? "default"} className="px-3 py-0.5 uppercase tracking-wide text-[10px]">
                                    {property.status}
                                </Badge>
                                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {property.title}
                                </h1>
                                <p className="font-display text-xl sm:text-2xl font-bold text-primary">
                                    {formatCurrency(property.price)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground border-y border-border py-4">
                                <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                                    <span className="truncate">{property.location}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Ruler className="h-4 w-4 text-primary shrink-0" /> {property.size} m²
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Home className="h-4 w-4 text-primary shrink-0" /> {property.type}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground text-sm sm:text-base">Description</h3>
                                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>

                            {property.amenities?.length > 0 && (
                                <div className="space-y-2.5">
                                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Amenities & Features</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((a: string) => (
                                            <Badge key={a} variant="secondary" className="px-3 py-1 text-xs font-medium">
                                                {a}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isDashboard && (
                                <Can do="manageProperties">
                                    <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center gap-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Status Action:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {["AVAILABLE", "RESERVED", "SOLD"].map((s) => (
                                                <Button
                                                    key={s}
                                                    variant={s === property.status ? "secondary" : "outline"}
                                                    size="sm"
                                                    disabled={updating || s === property.status}
                                                    onClick={() => handleStatusChange(s)}
                                                    className="text-xs"
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

            {/* --- EDIT PROPERTY MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
                    <div className="relative w-full pt-28 mt-28  max-w-5xl max-h-[70vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl p-2 sm:p-4">
                        <button
                            onClick={() => {
                                setIsEditModalOpen(false);
                                refetch(); // Refresh data in case form was updated
                            }}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <EditProperty propertyId={id} />
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-foreground">Delete Property</h3>
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete <span className="font-semibold text-foreground">"{property.title}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={deleting}
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleting}
                                onClick={handleDeleteProperty}
                                className="gap-1.5"
                            >
                                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {deleting ? "Deleting..." : "Delete Property"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, X, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    UPDATE_PROPERTY_MUTATION,
    PROPERTY_DETAIL_QUERY
} from "@/dashboard/lib/graphql/documents";
import useUploader from "@/dashboard/lib/useUploader";

const propertyFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().positive("Enter a valid price"),
    location: z.string().min(2, "Location is required"),
    type: z.enum(["APARTMENT", "HOUSE", "LAND", "COMMERCIAL", "DUPLEX"]),
    size: z.coerce.number().positive("Enter a valid size"),
    images: z.array(
        z.object({
            url: z.string().url("Must be a valid URL"),
            publicId: z.string().min(1, "Public ID is required"),
        })
    ).min(1, "Please keep or upload at least one property image."),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface LocalFileQueue {
    id: string;
    status: "uploading" | "success" | "error";
    uploadedUrl?: string;
    uploadedPublicId?: string;
    formIndex?: number;
}

interface EditPropertyProps {
    propertyId: string;
}

export default function EditProperty({ propertyId }: EditPropertyProps) {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [uploadQueue, setUploadQueue] = useState<LocalFileQueue[]>([]);

    // 1. Fetch Existing Property Details using PROPERTY_DETAIL_QUERY
    const { data: initialData, loading: fetchingProperty, error: fetchError } = useQuery(PROPERTY_DETAIL_QUERY, {
        variables: { propertyId },
        skip: !propertyId,
    }) as any;

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        control,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<PropertyFormValues>({
        resolver: zodResolver(propertyFormSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "" as any,
            location: "",
            type: "APARTMENT",
            size: "" as any,
            images: [],
        },
    });

    // Populate form state once existing property data arrives
    useEffect(() => {
        const property = initialData?.property;
        if (property) {
            const formattedImages = (property.images || []).map((img: any) => ({
                url: img.url || "",
                publicId: img.publicId || "",
            }));

            reset({
                title: property.title || "",
                description: property.description || "",
                price: property.price || "",
                location: property.location || "",
                type: property.type || "APARTMENT",
                size: property.size || "",
                images: formattedImages,
            });

            // Populate uploadQueue for pre-existing images so they render in the grid layer
            const initialQueueItems: LocalFileQueue[] = formattedImages.map((img: any, idx: number) => ({
                id: `existing-${idx}-${img.publicId}`,
                status: "success",
                uploadedUrl: img.url,
                uploadedPublicId: img.publicId,
                formIndex: idx,
            }));

            setUploadQueue(initialQueueItems);
        }
    }, [initialData, reset]);

    const watchedImages = watch("images") || [];

    const { upload } = useUploader({
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkxe2zerp",
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "belhomz",
        onError: (err: any) => {
            setServerError(`Upload error: ${err}`);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: `Something went wrong: ${err}`,
            });
        },
    });

    // 2. Setup Update Property Mutation
    const [updateProperty] = useMutation<any>(UPDATE_PROPERTY_MUTATION);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setServerError(null);

        for (const file of selectedFiles) {
            const queueId = crypto.randomUUID();

            setUploadQueue((prev) => [
                ...prev,
                { id: queueId, status: "uploading" },
            ]);

            try {
                const result = await upload(file);
                if (result && result.secure_url) {
                    const currentImages = getValues("images") || [];
                    const newImage = { url: result.secure_url, publicId: result.public_id };
                    const nextImages = [...currentImages, newImage];
                    const savedIndex = nextImages.length - 1;

                    setValue("images", nextImages, { shouldValidate: true, shouldDirty: true });

                    setUploadQueue((prev) =>
                        prev.map((item) =>
                            item.id === queueId
                                ? {
                                    ...item,
                                    status: "success",
                                    uploadedUrl: result.secure_url,
                                    uploadedPublicId: result.public_id,
                                    formIndex: savedIndex,
                                }
                                : item
                        )
                    );

                    toast({
                        title: "Image added",
                        description: `${file.name.slice(0, 20)} uploaded to gallery.`,
                    });
                } else {
                    throw new Error("Missing secure URL from upload response");
                }
            } catch (err: any) {
                setUploadQueue((prev) =>
                    prev.map((item) =>
                        item.id === queueId ? { ...item, status: "error" } : item
                    )
                );
                setServerError(`Failed to upload ${file.name}.`);
                toast({
                    variant: "destructive",
                    title: "Image Upload Failed",
                    description: `Failed to upload ${file.name}.`,
                });
            }
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeUploadedImage = (indexToRemove: number, publicId: string) => {
        const updated = watchedImages.filter((_, idx) => idx !== indexToRemove);
        setValue("images", updated, { shouldValidate: true, shouldDirty: true });

        setUploadQueue((prev) => {
            const remaining = prev.filter((f) => f.uploadedPublicId !== publicId);

            return remaining.map((f) => {
                if (f.status === "success" && f.formIndex !== undefined && f.formIndex > indexToRemove) {
                    return { ...f, formIndex: f.formIndex - 1 };
                }
                return f;
            });
        });

        toast({
            description: "Image removed.",
        });
    };

    const removeQueueItem = (id: string) => {
        setUploadQueue((prev) => prev.filter((f) => f.id !== id));
    };

    const isCurrentlyUploading = uploadQueue.some((item) => item.status === "uploading");

    // 3. Form Submit Handler using exact GraphQL Update Input Structure
    const onSubmit: SubmitHandler<PropertyFormValues> = async (values) => {
        setServerError(null);

        if (values.images.length === 0) {
            setServerError("Please upload or retain at least one image.");
            return;
        }

        try {
            const { data } = await updateProperty({
                variables: {
                    updatePropertyId: propertyId,
                    input: {
                        title: values.title,
                        description: values.description,
                        price: values.price,
                        location: values.location,
                        type: values.type,
                        size: values.size,
                        amenities: initialData?.property?.amenities || null,
                        images: values.images.map((img) => ({
                            url: img.url,
                            publicId: img.publicId,
                        })),
                    },
                },
            });

            toast({
                title: "Property Updated Successfully!",
                description: `"${values.title}" modifications saved.`,
            });

            const targetId = data?.updateProperty?.id || propertyId;
            router.push(`/properties/${targetId}`);
        } catch (err: any) {
            const errMsg = CombinedGraphQLErrors.is(err)
                ? err.errors[0]?.message
                : err.message || "Unable to update property";

            setServerError(errMsg);

            toast({
                variant: "destructive",
                title: "Update Failed",
                description: errMsg,
            });
        }
    };

    if (fetchingProperty) {
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brass)]" />
                    <p className="text-sm font-medium text-zinc-500">Fetching property details...</p>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-[var(--color-danger)]">Failed to load property data.</p>
                    <Link href="/account/property" className="text-xs text-primary underline mt-2 inline-block">
                        Return to property listings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex  w-full justify-center p-3 sm:p-6 md:p-8">
            <div className="w-full max-w-6xl py-2 sm:py-6">
                <Link
                    href="/account/property"
                    className="mb-4 inline-flex font-bold items-center gap-1.5 text-xs sm:text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to properties
                </Link>

                <Card className="rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold mb-6">
                            Edit property
                        </h1>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                                {/* Left Column: Core Fields */}
                                <div className="space-y-4 sm:space-y-5 lg:col-span-7">
                                    {/* Title */}
                                    <div>
                                        <Label htmlFor="title" className="text-xs sm:text-sm font-medium">Title</Label>
                                        <Input id="title" placeholder="3-bedroom duplex in Lekki" className="mt-1" {...register("title")} />
                                        {errors.title && (
                                            <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground resize-y min-h-[100px]"
                                            placeholder="Describe the property…"
                                            {...register("description")}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-xs text-[var(--color-danger)]">
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price & Size */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price" className="text-xs sm:text-sm font-medium">Price (₦)</Label>
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field: { onChange, value, ref } }) => {
                                                    const displayValue = value
                                                        ? Number(value).toLocaleString("en-NG")
                                                        : "";

                                                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const rawValue = e.target.value.replace(/\D/g, "");
                                                        onChange(rawValue ? Number(rawValue) : "");
                                                    };

                                                    return (
                                                        <Input
                                                            id="price"
                                                            type="text"
                                                            ref={ref}
                                                            value={displayValue}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g. 150,000,000"
                                                            className="mt-1"
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.price && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.price.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="size" className="text-xs sm:text-sm font-medium">Size (m²)</Label>
                                            <Input id="size" type="number" step="any" className="mt-1" {...register("size")} />
                                            {errors.size && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.size.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location & Type */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="location" className="text-xs sm:text-sm font-medium">Location</Label>
                                            <Input id="location" placeholder="Lekki, Lagos" className="mt-1" {...register("location")} />
                                            {errors.location && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">
                                                    {errors.location.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="type" className="text-xs sm:text-sm font-medium">Type</Label>
                                            <select
                                                id="type"
                                                className="mt-1 h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground"
                                                {...register("type")}
                                            >
                                                <option value="APARTMENT">Apartment</option>
                                                <option value="HOUSE">House</option>
                                                <option value="LAND">Land</option>
                                                <option value="COMMERCIAL">Commercial</option>
                                                <option value="DUPLEX">Duplex</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Image Dropzone & Grid */}
                                <div className="space-y-4 lg:col-span-5 border-t lg:border-t-0 pt-6 lg:pt-0 lg:pl-6 lg:border-l border-[var(--color-border)]">
                                    <Label className="text-sm sm:text-base font-semibold">Property Images</Label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {/* Dropzone */}
                                    <div
                                        onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                        className={`border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center bg-[var(--color-paper-raised)]/40 transition active:scale-[0.99] ${
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--color-brass)]"
                                        }`}
                                    >
                                        <Upload className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--color-ink-muted)] mb-2" />
                                        <span className="text-xs sm:text-sm font-medium">Upload Additional Images</span>
                                        <span className="text-[11px] sm:text-xs text-[var(--color-ink-muted)] text-center mt-1">
                                            PNG, JPG, WebP (select multiple)
                                        </span>
                                    </div>

                                    {errors.images && (
                                        <p className="text-xs text-[var(--color-danger)] font-medium">
                                            {errors.images.message}
                                        </p>
                                    )}

                                    {/* Queue / Existing Image Grid */}
                                    {uploadQueue.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3 mt-3">
                                            {uploadQueue.map((item) => {
                                                const isCompleted = item.status === "success";
                                                const isFailed = item.status === "error";

                                                const directCloudinaryUrl = isCompleted && item.formIndex !== undefined && watchedImages[item.formIndex]
                                                    ? watchedImages[item.formIndex].url
                                                    : item.uploadedUrl;

                                                return (
                                                    <div key={item.id} className="relative group aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] bg-zinc-900 flex items-center justify-center">
                                                        {isCompleted && directCloudinaryUrl ? (
                                                            <img
                                                                src={directCloudinaryUrl}
                                                                alt="Property"
                                                                className="object-cover h-full w-full"
                                                                onError={(e) => {
                                                                    console.error("Image loading error", e);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full h-full bg-zinc-950/60 text-zinc-400">
                                                                <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-600 animate-pulse" />
                                                            </div>
                                                        )}

                                                        {/* Spinner Overlay */}
                                                        {item.status === "uploading" && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-1.5">
                                                                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[var(--color-brass)]" />
                                                                <span className="text-[9px] sm:text-[10px] text-white font-semibold">Uploading...</span>
                                                            </div>
                                                        )}

                                                        {/* Success / Existing Overlay */}
                                                        {isCompleted && (
                                                            <>
                                                                <div className="absolute top-1.5 left-1.5 bg-green-600/90 p-0.5 rounded-full text-white">
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => {
                                                                        const publicId = item.uploadedPublicId || (item.formIndex !== undefined ? watchedImages[item.formIndex]?.publicId : null);
                                                                        if (item.formIndex !== undefined && publicId) {
                                                                            removeUploadedImage(item.formIndex, publicId);
                                                                        } else {
                                                                            removeQueueItem(item.id);
                                                                        }
                                                                    }}
                                                                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-black/80"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Failure Overlay */}
                                                        {isFailed && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/85 p-2 text-center">
                                                                <span className="text-[9px] sm:text-[10px] text-red-200 font-semibold mb-1">Upload Failed</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeQueueItem(item.id)}
                                                                    className="p-1 bg-white/20 rounded text-white text-[10px] hover:bg-white/30"
                                                                >
                                                                    Dismiss
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sticky / Pinned Mobile Action Footer */}
                            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col gap-4">
                                {serverError && (
                                    <p className="rounded-lg bg-[var(--color-danger-soft)] px-3 py-2 text-xs sm:text-sm text-[var(--color-danger)]">
                                        {serverError}
                                    </p>
                                )}

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/account/property")}
                                        className="px-6 h-11 sm:h-10 text-sm font-semibold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isCurrentlyUploading || !isDirty}
                                        className="px-8 h-11 sm:h-10 text-sm font-semibold"
                                    >
                                        {isSubmitting ? "Saving changes..." : "Save changes"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
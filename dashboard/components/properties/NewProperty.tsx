"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client";
import { useState, useRef } from "react";
import { ArrowLeft, Upload, X, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Added Toast Hook
import { CREATE_PROPERTY_MUTATION } from "@/dashboard/lib/graphql/documents";
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
    ).min(1, "Please upload at least one property image."),
});
type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface LocalFileQueue {
    id: string;
    status: "uploading" | "success" | "error";
    uploadedUrl?: string;      // Direct Cloudinary URL
    uploadedPublicId?: string; // Direct Cloudinary Public ID
    formIndex?: number;        // Direct link to react-hook-form state index
}

export default function NewProperty() {
    const router = useRouter();
    const { toast } = useToast(); // Initialized toast
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [uploadQueue, setUploadQueue] = useState<LocalFileQueue[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        control,
        formState: { errors, isSubmitting },
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

    const [createProperty] = useMutation<any>(CREATE_PROPERTY_MUTATION);

    // Handles picking local files and uploading them immediately
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setServerError(null);

        for (const file of selectedFiles) {
            const queueId = crypto.randomUUID();

            // Register visual uploading block
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

                    // Push directly to form state
                    setValue("images", nextImages, { shouldValidate: true });

                    // Resolve local block state with production Cloudinary credentials
                    setUploadQueue((prev) =>
                        prev.map((item) =>
                            item.id === queueId
                                ? {
                                    ...item,
                                    status: "success",
                                    uploadedUrl: result.secure_url,
                                    uploadedPublicId: result.public_id,
                                    formIndex: savedIndex
                                }
                                : item
                        )
                    );

                    // Image Upload Success Toast
                    toast({
                        title: "Image uploaded successfully",
                        description: `${file.name.slice(0, 20)}${file.name.length > 20 ? "..." : ""} added to preview.`,
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
        setValue("images", updated, { shouldValidate: true });

        setUploadQueue((prev) => {
            const remaining = prev.filter((f) => f.uploadedPublicId !== publicId);

            // Correctly realign the indexes of subsequent assets in the react-hook-form array
            return remaining.map((f) => {
                if (f.status === "success" && f.formIndex !== undefined && f.formIndex > indexToRemove) {
                    return { ...f, formIndex: f.formIndex - 1 };
                }
                return f;
            });
        });

        toast({
            description: "Image removed from property.",
        });
    };

    const removeQueueItem = (id: string) => {
        setUploadQueue((prev) => prev.filter((f) => f.id !== id));
    };

    const isCurrentlyUploading = uploadQueue.some((item) => item.status === "uploading");

    const onSubmit: SubmitHandler<PropertyFormValues> = async (values) => {
        setServerError(null);

        if (values.images.length === 0) {
            setServerError("Please upload at least one property image before submitting.");
            return;
        }

        try {
            const { data } = await createProperty({
                variables: {
                    input: values,
                },
            });

            setUploadQueue([]);

            // Success Toast
            toast({
                title: "Property Created Successfully!",
                description: `"${values.title}" has been listed.`,
            });

            if (data?.createProperty?.id) {
                router.push(`/properties/${data.createProperty.id}`);
            } else {
                router.push("/account/property");
            }
        } catch (err: any) {
            const errMsg = CombinedGraphQLErrors.is(err)
                ? err.errors[0]?.message
                : err.message || "Unable to create property";

            setServerError(errMsg);

            toast({
                variant: "destructive",
                title: "Property Creation Failed",
                description: errMsg,
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl py-6">
                <Link
                    href="/account/property"
                    className="mb-4 inline-flex font-bold items-center gap-1 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to properties
                </Link>

                <Card>
                    <CardContent className="p-6">
                        <h1 className="font-display text-xl font-semibold mb-6">Add a new property</h1>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Left Side: Main Form Fields */}
                                <div className="space-y-5 md:col-span-7">
                                    {/* Title */}
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" placeholder="3-bedroom duplex in Lekki" {...register("title")} />
                                        {errors.title && (
                                            <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            rows={5}
                                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground"
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price (₦)</Label>
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
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.price && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.price.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="size">Size (m²)</Label>
                                            <Input id="size" type="number" step="any" {...register("size")} />
                                            {errors.size && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.size.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location & Type */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input id="location" placeholder="Lekki, Lagos" {...register("location")} />
                                            {errors.location && (
                                                <p className="mt-1 text-xs text-[var(--color-danger)]">
                                                    {errors.location.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="type">Type</Label>
                                            <select
                                                id="type"
                                                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground"
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

                                {/* Right Side: Dynamic Image Upload Grid */}
                                <div className="space-y-4 md:col-span-5 border-t md:border-t-0 pt-6 md:pt-0 md:pl-6 md:border-l border-[var(--color-border)]">
                                    <Label className="text-base font-semibold">Property Images</Label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {/* Dropzone Trigger */}
                                    <div
                                        onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                        className={`border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center justify-center bg-[var(--color-paper-raised)]/40 transition ${
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--color-brass)]"
                                        }`}
                                    >
                                        <Upload className="h-8 w-8 text-[var(--color-ink-muted)] mb-2" />
                                        <span className="text-sm font-medium">Upload Images</span>
                                        <span className="text-xs text-[var(--color-ink-muted)] text-center mt-1">
                                            PNG, JPG, WebP (select multiple)
                                        </span>
                                    </div>

                                    {errors.images && (
                                        <p className="text-xs text-[var(--color-danger)] font-medium">
                                            {errors.images.message}
                                        </p>
                                    )}

                                    {/* Interactive Grid without any blobs */}
                                    {uploadQueue.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 mt-3">
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
                                                                    console.error("Cloudinary image failed to load", e);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full h-full bg-zinc-950/60 text-zinc-400">
                                                                <ImageIcon className="h-6 w-6 text-zinc-600 animate-pulse" />
                                                            </div>
                                                        )}

                                                        {/* Spinner Overlay while Uploading */}
                                                        {item.status === "uploading" && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-1.5">
                                                                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-brass)]" />
                                                                <span className="text-[10px] text-white font-semibold">Uploading...</span>
                                                            </div>
                                                        )}

                                                        {/* Success Overlays */}
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
                                                                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/80"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Error State Overlays */}
                                                        {isFailed && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/85 p-2 text-center">
                                                                <span className="text-[10px] text-red-200 font-semibold mb-1">Upload Failed</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeQueueItem(item.id)}
                                                                    className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30"
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

                            {/* Footer Area */}
                            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col gap-4">
                                {serverError && (
                                    <p className="rounded-lg bg-[var(--color-danger-soft)] px-3 py-2 text-sm text-[var(--color-danger)]">
                                        {serverError}
                                    </p>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isCurrentlyUploading}
                                        className="w-full sm:w-auto px-8"
                                    >
                                        {isSubmitting ? "Saving property..." : "Create property"}
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
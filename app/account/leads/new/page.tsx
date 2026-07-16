"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client";
import { ArrowLeft, UserPlus, Loader2, Building2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    CREATE_LEAD_MUTATION,
    LEADS_QUERY,
    PROPERTIES_QUERY,
    ME_QUERY,
} from "@/dashboard/lib/graphql/documents";
import { STATUS_TABS } from "@/dashboard/components/properties/Properties";

const createLeadSchema = z.object({
    clientName: z.string().min(2, "Client name is required"),
    clientPhone: z.string().min(7, "Enter a valid phone number"),
    clientEmail: z.string().email("Invalid email address").or(z.literal("")),
    property: z.string().optional(),
    assignedAgent: z.string().min(1, "Assigned agent ID is required"),
    stage: z.enum([
        "NEW",
        "CONTACTED",
        "INSPECTION_BOOKED",
        "NEGOTIATION",
        "CLOSED_WON",
        "CLOSED_LOST",
    ]),
});

type CreateLeadFormValues = z.infer<typeof createLeadSchema>;

export default function NewLeadPage() {
    const [status] = useState<(typeof STATUS_TABS)[number]>("ALL");
    const [search] = useState("");
    const router = useRouter();
    const { toast } = useToast();
    const [serverError, setServerError] = useState<string | null>(null);

    // 1. Get current logged-in user
    const { data: meData, loading: loadingMe } = useQuery<any>(ME_QUERY);
    const currentUserId = meData?.me?.id || meData?.me?._id || "";
    const currentUserName = meData?.me?.name || meData?.me?.fullName || "";

    // 2. Get properties
    const { data: propertiesData, loading: loadingProperties } = useQuery<any>(
        PROPERTIES_QUERY,
        {
            variables: {
                filter: {
                    ...(status !== "ALL" ? { status } : {}),
                    ...(search ? { search } : {}),
                    limit: 50,
                },
            },
        }
    );

    const properties = propertiesData?.properties?.items ?? propertiesData?.properties ?? [];

    // Mutation setup
    const [createLead, { loading: isSubmitting }] = useMutation<any>(
        CREATE_LEAD_MUTATION,
        {
            refetchQueries: [{ query: LEADS_QUERY, variables: {} }],
        }
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateLeadFormValues>({
        resolver: zodResolver(createLeadSchema),
        defaultValues: {
            clientName: "",
            clientPhone: "",
            clientEmail: "",
            property: "",
            assignedAgent: "",
            stage: "NEW",
        },
    });

    // Automatically update the react-hook-form value with user's ID when ME_QUERY finishes
    useEffect(() => {
        if (currentUserId) {
            setValue("assignedAgent", currentUserId, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [currentUserId, setValue]);

    const onSubmit: SubmitHandler<CreateLeadFormValues> = async (values) => {
        setServerError(null);

        // Clean up payload so empty strings aren't sent to GraphQL
        const formattedInput = {
            clientName: values.clientName.trim(),
            clientPhone: values.clientPhone.trim(),
            stage: values.stage,
            assignedAgent: values.assignedAgent, // Strictly passes the User ID
            ...(values.clientEmail?.trim()
                ? { clientEmail: values.clientEmail.trim() }
                : {}),
            ...(values.property?.trim() ? { property: values.property.trim() } : {}), // Strictly passes the Property ID
        };

        try {
            const { data } = await createLead({
                variables: { input: formattedInput },
            });

            toast({
                title: "Lead Created Successfully",
                description: `Lead for ${values.clientName} has been created.`,
            });

            if (data?.createLead?.id) {
                router.push(`/account/leads`);
                // router.push(`/account/leads/${data.createLead.id}`);
            } else {
                router.push("/account/leads");
            }
        } catch (err: any) {
            const errMsg = CombinedGraphQLErrors.is(err)
                ? err.errors[0]?.message
                : err.message || "Failed to create lead. Please try again.";

            setServerError(errMsg);
            toast({
                variant: "destructive",
                title: "Error Creating Lead",
                description: errMsg,
            });
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full justify-center p-4 sm:p-5 lg:p-8">
            <div className="w-full max-w-5xl py-2 sm:py-4">
                {/* Back Link */}
                <Link
                    href="/account/leads"
                    className="mb-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to leads
                </Link>

                {/* Card Form Wrapper */}
                <Card className="rounded-xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper-raised)]/30 shadow-sm overflow-hidden">
                    <CardContent className="p-5 sm:p-8 lg:p-10">
                        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-[var(--color-border)]">
                            <UserPlus className="h-6 w-6 text-[var(--color-brass)] shrink-0" />
                            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                                Add New Lead
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Hidden input to hold the user ID for React Hook Form validation */}
                            <input type="hidden" {...register("assignedAgent")} />

                            {/* Client Name & Stage */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="clientName" className="text-xs sm:text-sm font-medium">
                                        Client Name *
                                    </Label>
                                    <Input
                                        id="clientName"
                                        placeholder="cynthia philips"
                                        className="h-10 sm:h-11 px-4 text-xs sm:text-sm"
                                        {...register("clientName")}
                                    />
                                    {errors.clientName && (
                                        <p className="mt-1 text-xs text-[var(--color-danger)]">
                                            {errors.clientName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="stage" className="text-xs sm:text-sm font-medium">
                                        Initial Stage
                                    </Label>
                                    <select
                                        id="stage"
                                        className="h-10 sm:h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_1rem_center] bg-no-repeat px-4"
                                        {...register("stage")}
                                    >
                                        <option value="NEW" className="py-2">New</option>
                                        <option value="CONTACTED" className="py-2">Contacted</option>
                                        <option value="INSPECTION_BOOKED" className="py-2">Inspection Booked</option>
                                        <option value="NEGOTIATION" className="py-2">Negotiation</option>
                                        <option value="CLOSED_WON" className="py-2">Closed Won</option>
                                        <option value="CLOSED_LOST" className="py-2">Closed Lost</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Details: Phone & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="clientPhone" className="text-xs sm:text-sm font-medium">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="clientPhone"
                                        type="tel"
                                        placeholder="+234 800 000 0000"
                                        className="h-10 sm:h-11 px-4 text-xs sm:text-sm font-mono"
                                        {...register("clientPhone")}
                                    />
                                    {errors.clientPhone && (
                                        <p className="mt-1 text-xs text-[var(--color-danger)]">
                                            {errors.clientPhone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="clientEmail" className="text-xs sm:text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        placeholder="cynthiaphilips@belhomz.com"
                                        className="h-10 sm:h-11 px-4 text-xs sm:text-sm font-mono"
                                        {...register("clientEmail")}
                                    />
                                    {errors.clientEmail && (
                                        <p className="mt-1 text-xs text-[var(--color-danger)]">
                                            {errors.clientEmail.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Property Selector & Assigned Agent */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                {/* Property Dropdown (Value = ID, Display = Title/Name) */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="property"
                                        className="text-xs sm:text-sm font-medium flex items-center gap-1.5"
                                    >
                                        <Building2 className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" />
                                        Select Property
                                    </Label>
                                    <select
                                        id="property"
                                        disabled={loadingProperties}
                                        className="h-10 sm:h-11 px-4 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] text-foreground cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_1rem_center] bg-no-repeat disabled:opacity-50"
                                        {...register("property")}
                                    >
                                        <option value="" className="py-2">
                                            {loadingProperties
                                                ? "Loading properties…"
                                                : "-- Select Property --"}
                                        </option>
                                        {properties.map((p: any) => (
                                            <option key={p.id || p._id} value={p.id || p._id} className="py-2">
                                                {p.title || p.name || `Property #${p.id || p._id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Assigned Agent (Displays Name, Form stores ID) */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="assignedAgentDisplay" className="text-xs sm:text-sm font-medium">
                                        Assigned Agent
                                    </Label>
                                    <Input
                                        id="assignedAgentDisplay"
                                        value={loadingMe ? "Loading agent details..." : currentUserName}
                                        className="h-10 sm:h-11 px-4 text-xs sm:text-sm bg-[var(--color-paper-raised)]/50 text-[var(--color-ink)]"
                                        readOnly
                                    />
                                    {errors.assignedAgent && (
                                        <p className="mt-1 text-xs text-[var(--color-danger)]">
                                            {errors.assignedAgent.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Form Action Buttons & Alerts */}
                            <div className="pt-8 border-t border-[var(--color-border)] space-y-4">
                                {serverError && (
                                    <p className="rounded-lg bg-[var(--color-danger-soft)]/20 border border-[var(--color-danger-soft)] px-3.5 py-3 text-xs sm:text-sm text-[var(--color-danger)] font-medium">
                                        {serverError}
                                    </p>
                                )}

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/account/leads")}
                                        className="w-30 sm:w-28 h-10 sm:h-11 text-xs sm:text-sm font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-30 sm:w-36 h-10 sm:h-11 px-6 text-xs sm:text-sm font-semibold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving…
                                            </>
                                        ) : (
                                            "Create Lead"
                                        )}
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
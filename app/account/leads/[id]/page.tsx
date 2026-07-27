"use client";

import { use, useState, useCallback, useMemo, ChangeEvent, MouseEvent } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Building2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  User,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Can } from "@/dashboard/components/auth/can";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LEAD_DETAIL_QUERY,
  PROPERTY_DETAIL_QUERY,
  SCHEDULE_INSPECTION_MUTATION,
  RESCHEDULE_INSPECTION_MUTATION,
  UPDATE_LEAD_MUTATION,
} from "@/dashboard/lib/graphql/documents";

// ============================================================================
// Types
// ============================================================================

export type LeadStage =
    | "NEW"
    | "CONTACTED"
    | "INSPECTION_BOOKED"
    | "NEGOTIATION"
    | "CLOSED_WON"
    | "CLOSED_LOST";

export interface Activity {
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface Inspection {
  scheduledAt: string | null;
  location: string | null;
  notes: string | null;
  completed: boolean;
}

export interface Lead {
  id: string;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  property: string | null;
  assignedAgent: string | null;
  stage: LeadStage | null;
  activities: Activity[];
  inspection: Inspection | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDetailData {
  lead: Lead | null;
}

export interface LeadDetailVariables {
  leadId: string;
}

export interface UpdateLeadInput {
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  property?: string | null;
  stage?: LeadStage | null;
}

export interface UpdateLeadData {
  updateLead: Lead;
}

export interface UpdateLeadVariables {
  updateLeadId: string;
  input: UpdateLeadInput;
}

export interface ScheduleInspectionInput {
  scheduledAt: string;
  location: string;
  notes?: string | null;
  stage: LeadStage;
}

export interface ScheduleInspectionData {
  scheduleInspection: Lead;
}

export interface ScheduleInspectionVariables {
  scheduleInspectionId: string;
  input: ScheduleInspectionInput;
}

export interface RescheduleInspectionInput {
  scheduledAt?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface RescheduleInspectionData {
  rescheduleInspection: Lead;
}

export interface RescheduleInspectionVariables {
  input: RescheduleInspectionInput;
  rescheduleInspectionId: string;
}

interface EditFormState {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  property: string;
  stage: LeadStage | "";
}

// ============================================================================
// Constants & Helpers
// ============================================================================

const STAGES: ReadonlyArray<{ key: LeadStage; label: string; color: string }> = [
  { key: "NEW", label: "New", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { key: "CONTACTED", label: "Contacted", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { key: "INSPECTION_BOOKED", label: "Inspection Booked", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  { key: "CLOSED_WON", label: "Closed Won", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { key: "CLOSED_LOST", label: "Closed Lost", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
] as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function formatInspectionDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const num = Number(dateString);
  const parsed = new Date(!isNaN(num) && dateString.trim() !== "" ? num : dateString);

  if (isNaN(parsed.getTime())) return dateString;

  return parsed.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const num = Number(dateString);
  const parsed = new Date(!isNaN(num) && dateString.trim() !== "" ? num : dateString);

  if (isNaN(parsed.getTime())) return dateString;

  return parsed.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}

// ============================================================================
// Main Lead Detail Component
// ============================================================================

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Form & UI States
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [editForm, setEditForm] = useState<EditFormState>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    property: "",
    stage: "",
  });

  const [inspectionDatePart, setInspectionDatePart] = useState("");
  const [inspectionTimePart, setInspectionTimePart] = useState("09:00");
  const [inspectionLocation, setInspectionLocation] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  const inspectionDate = useMemo(() => {
    if (!inspectionDatePart) return "";
    return `${inspectionDatePart}T${inspectionTimePart || "00:00"}`;
  }, [inspectionDatePart, inspectionTimePart]);

  // Fetch Lead Detail Query
  const { data, loading } = useQuery<LeadDetailData, LeadDetailVariables>(LEAD_DETAIL_QUERY, {
    variables: { leadId: id },
  });

  const lead = data?.lead;

  // Fetch Associated Property Data dynamically using lead.property ID
  const { data: propertyData, loading: loadingProperty } = useQuery<any>(
      PROPERTY_DETAIL_QUERY,
      {
        variables: { propertyId: lead?.property || "" },
        skip: !lead?.property,
      }
  );

  const property = propertyData?.property;

  // Apollo Mutations
  const [updateLead, { loading: updating }] = useMutation<UpdateLeadData, UpdateLeadVariables>(
      UPDATE_LEAD_MUTATION,
      {
        onCompleted: () => {
          setIsEditing(false);
        },
        update: (cache, { data: mutationData }) => {
          if (!mutationData?.updateLead) return;
          cache.writeQuery<LeadDetailData, LeadDetailVariables>({
            query: LEAD_DETAIL_QUERY,
            variables: { leadId: id },
            data: { lead: mutationData.updateLead },
          });
        },
      }
  );

  const [scheduleInspection, { loading: scheduling }] = useMutation<
      ScheduleInspectionData,
      ScheduleInspectionVariables
  >(SCHEDULE_INSPECTION_MUTATION, {
    onCompleted: () => {
      setShowInspectionForm(false);
      resetInspectionForm();
    },
    onError: (err) => {
      console.error("GraphQL Error:", err);
      setFormError(err.message || "Failed to schedule inspection. Please try again.");
    },
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.scheduleInspection) return;
      cache.writeQuery<LeadDetailData, LeadDetailVariables>({
        query: LEAD_DETAIL_QUERY,
        variables: { leadId: id },
        data: { lead: mutationData.scheduleInspection },
      });
    },
  });

  const [rescheduleInspection, { loading: rescheduling }] = useMutation<
      RescheduleInspectionData,
      RescheduleInspectionVariables
  >(RESCHEDULE_INSPECTION_MUTATION, {
    onCompleted: () => {
      setShowInspectionForm(false);
      setIsRescheduling(false);
      resetInspectionForm();
    },
    onError: (err) => {
      console.error("Reschedule Error:", err);
      setFormError(err.message || "Failed to reschedule inspection. Please try again.");
    },
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.rescheduleInspection) return;
      cache.writeQuery<LeadDetailData, LeadDetailVariables>({
        query: LEAD_DETAIL_QUERY,
        variables: { leadId: id },
        data: { lead: mutationData.rescheduleInspection },
      });
    },
  });


  const resetInspectionForm = () => {
    setInspectionDatePart("");
    setInspectionTimePart("09:00");
    setInspectionLocation("");
    setInspectionNotes("");
    setFormError(null);
  };

  const startRescheduling = useCallback(() => {
    if (!lead?.inspection) return;
    setIsRescheduling(true);
    setShowInspectionForm(true);

    if (lead.inspection.scheduledAt) {
      const dt = new Date(lead.inspection.scheduledAt);
      if (!isNaN(dt.getTime())) {
        setInspectionDatePart(dt.toISOString().split("T")[0]);
        setInspectionTimePart(dt.toTimeString().slice(0, 5));
      }
    }
    setInspectionLocation(lead.inspection.location || "");
    setInspectionNotes(lead.inspection.notes || "");
  }, [lead?.inspection]);

  // Event Handlers
  const startEditing = useCallback(() => {
    if (!lead) return;
    setEditForm({
      clientName: lead.clientName || "",
      clientPhone: lead.clientPhone || "",
      clientEmail: lead.clientEmail || "",
      property: lead.property || "",
      stage: lead.stage || "NEW",
    });
    setIsEditing(true);
  }, [lead]);

  const handleUpdateLead = useCallback(async () => {
    try {
      await updateLead({
        variables: {
          updateLeadId: id,
          input: {
            clientName: editForm.clientName || null,
            clientPhone: editForm.clientPhone || null,
            clientEmail: editForm.clientEmail || null,
            property: editForm.property || null,
            stage: (editForm.stage as LeadStage) || null,
          },
        },
      });
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  }, [id, editForm, updateLead]);

  const handleSubmitInspection = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!inspectionDate) {
          setFormError("Please select a date and time for the inspection.");
          return;
        }

        if (!inspectionLocation.trim()) {
          setFormError("Please enter an inspection location.");
          return;
        }

        const parsedDate = new Date(inspectionDate);
        if (isNaN(parsedDate.getTime())) {
          setFormError("Invalid date format. Please re-select the date.");
          return;
        }

        try {
          if (isRescheduling) {
            await rescheduleInspection({
              variables: {
                rescheduleInspectionId: id,
                input: {
                  scheduledAt: parsedDate.toISOString(),
                  location: inspectionLocation.trim(),
                  notes: inspectionNotes.trim() ? inspectionNotes.trim() : null,
                },
              },
            });
          } else {
            await scheduleInspection({
              variables: {
                scheduleInspectionId: id,
                input: {
                  scheduledAt: parsedDate.toISOString(),
                  location: inspectionLocation.trim(),
                  notes: inspectionNotes.trim() ? inspectionNotes.trim() : null,
                  stage: "INSPECTION_BOOKED",
                },
              },
            });
          }
        } catch {
          // Error state handled in mutation onError hook
        }
      },
      [
        id,
        inspectionDate,
        inspectionLocation,
        inspectionNotes,
        isRescheduling,
        rescheduleInspection,
        scheduleInspection,
      ]
  );

  const currentStageConfig = useMemo(() => {
    return STAGES.find((s) => s.key === lead?.stage) ?? {
      key: "NEW",
      label: lead?.stage ?? "New",
      color: "bg-secondary text-foreground",
    };
  }, [lead?.stage]);

  const formattedInspectionDate = useMemo(() => {
    return formatInspectionDate(lead?.inspection?.scheduledAt);
  }, [lead?.inspection?.scheduledAt]);

  if (loading) {
    return (
        <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
    );
  }

  if (!lead) {
    return (
        <div className="max-w-5xl mx-auto space-y-4 px-4 py-8">
          <Link
              href="/account/leads"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to leads
          </Link>
          <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
            Lead record not found or has been removed.
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-8xl mx-auto space-y-6 px-4 sm:px-6 py-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
              href="/account/leads"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to leads
          </Link>
          <span className="text-xs text-muted-foreground font-mono">
          Created {formatDate(lead.createdAt)}
        </span>
        </div>

        {/* Main Lead Summary Card */}
        <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
          <CardContent className="p-6">
            {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                          {lead.clientName || "Unnamed Lead"}
                        </h1>
                        <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 border ${currentStageConfig.color}`}>
                          {currentStageConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Lead ID: <span className="font-mono">{lead.id}</span>
                      </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditing}
                        className="h-9 px-3 text-xs font-semibold self-start shrink-0"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      Edit Details
                    </Button>
                  </div>

                  {/* Quick Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="truncate">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Phone</span>
                        {lead.clientPhone ? (
                            <a href={`tel:${lead.clientPhone}`} className="text-foreground hover:text-primary transition-colors font-mono">
                              {lead.clientPhone}
                            </a>
                        ) : (
                            <span className="text-muted-foreground/60 italic">Not provided</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="truncate">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Email</span>
                        {lead.clientEmail ? (
                            <a href={`mailto:${lead.clientEmail}`} className="text-foreground hover:text-primary transition-colors font-mono truncate block">
                              {lead.clientEmail}
                            </a>
                        ) : (
                            <span className="text-muted-foreground/60 italic">Not provided</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="truncate">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Property ID</span>
                        <span className="text-foreground font-mono truncate block">{lead.property || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                /* Inline Edit Lead Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Edit Lead Details
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Client Name</Label>
                      <Input
                          className="h-9 text-xs rounded-lg"
                          value={editForm.clientName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientName: e.target.value }))
                          }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Pipeline Stage</Label>
                      <Select
                          value={editForm.stage}
                          onValueChange={(val: LeadStage) =>
                              setEditForm((prev) => ({ ...prev, stage: val }))
                          }
                      >
                        <SelectTrigger className="h-9 text-xs rounded-lg">
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                              <SelectItem key={s.key} value={s.key} className="text-xs font-medium">
                                {s.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Phone Number</Label>
                      <Input
                          className="h-9 text-xs font-mono rounded-lg"
                          value={editForm.clientPhone}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientPhone: e.target.value }))
                          }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Email Address</Label>
                      <Input
                          className="h-9 text-xs font-mono rounded-lg"
                          value={editForm.clientEmail}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientEmail: e.target.value }))
                          }
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-semibold">Associated Property ID</Label>
                      <Input
                          className="h-9 text-xs font-mono rounded-lg"
                          value={editForm.property}
                          disabled
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8 text-xs font-medium">
                      Cancel
                    </Button>
                    <Button size="sm" disabled={updating} onClick={handleUpdateLead} className="h-8 text-xs font-semibold">
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs View Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50 py-1 border border-border rounded-lg grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="overview" className="text-xs font-semibold rounded-md px-4">Overview & Property</TabsTrigger>
            <TabsTrigger value="inspection" className="text-xs font-semibold rounded-md px-4">Inspection</TabsTrigger>
            <TabsTrigger value="activities" className="text-xs font-semibold rounded-md px-4">Activities ({lead.activities?.length ?? 0})</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
              <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-bold text-foreground">
                      Interested Property Details
                    </CardTitle>
                  </div>
                  {property && (
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <Link href={`/account/property/${property.id || property._id}`} className="flex items-center gap-1">
                          View Full Listing
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingProperty ? (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground animate-pulse py-4">
                      <Building2 className="h-5 w-5" />
                      Loading associated property information…
                    </div>
                ) : property ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {property.images?.[0]?.url && (
                          <div className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted relative">
                            <img
                                src={property.images[0].url}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                            {property.status && (
                                <Badge className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm text-white">
                                  {property.status}
                                </Badge>
                            )}
                          </div>
                      )}

                      <div className={property.images?.[0]?.url ? "md:col-span-8 space-y-3" : "md:col-span-12 space-y-3"}>
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {property.title || property.name || "Untitled Property"}
                          </h3>
                          {property.address && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {property.address}
                              </p>
                          )}
                        </div>

                        <div className="text-lg font-bold font-mono text-primary">
                          {property.price ? formatCurrency(property.price) : "Price on Request"}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border/60">
                          {property.bedrooms && (
                              <span className="flex items-center gap-1.5">
                          <Bed className="h-4 w-4 text-foreground/70" />
                                {property.bedrooms} Beds
                        </span>
                          )}
                          {property.bathrooms && (
                              <span className="flex items-center gap-1.5">
                          <Bath className="h-4 w-4 text-foreground/70" />
                                {property.bathrooms} Baths
                        </span>
                          )}
                          {property.size && (
                              <span className="flex items-center gap-1.5">
                          <Ruler className="h-4 w-4 text-foreground/70" />
                                {property.size} sqft
                        </span>
                          )}
                        </div>
                      </div>
                    </div>
                ) : lead.property ? (
                    <div className="text-xs text-muted-foreground italic py-2">
                      Property ID <span className="font-mono font-medium">{lead.property}</span> is linked to this lead, but details could not be retrieved.
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic py-2">
                      No property is currently attached to this lead.
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inspection Tab Content */}
          <TabsContent value="inspection" className="space-y-6 mt-0">
            <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
              <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-bold text-foreground">
                      Property Inspection Status
                    </CardTitle>
                  </div>
                  <Can do="scheduleInspections">
                    {!showInspectionForm && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setFormError(null);
                              setIsRescheduling(!!lead.inspection?.scheduledAt);
                              if (lead.inspection?.scheduledAt) {
                                startRescheduling();
                              } else {
                                setShowInspectionForm(true);
                              }
                            }}
                            className="h-8 text-xs font-semibold"
                        >
                          {lead.inspection?.scheduledAt ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Reschedule Inspection
                              </>
                          ) : (
                              <>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Schedule Inspection
                              </>
                          )}
                        </Button>
                    )}
                  </Can>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Existing Inspection Banner */}
                {lead.inspection?.scheduledAt && !showInspectionForm && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                          Inspection Active
                        </div>
                        {lead.inspection.completed && (
                            <Badge className="bg-emerald-600 text-white text-[10px]">Completed</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-foreground font-medium border-t border-emerald-500/20">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-0.5">Scheduled Date & Time</span>
                          <span className="font-mono text-sm">{formattedInspectionDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-0.5">Location</span>
                          <span>{lead.inspection.location || "Property Location"}</span>
                        </div>
                      </div>

                      {lead.inspection.notes && (
                          <div className="pt-2 text-xs text-muted-foreground border-t border-emerald-500/20">
                            <span className="font-semibold text-foreground">Notes: </span>
                            {lead.inspection.notes}
                          </div>
                      )}
                    </div>
                )}

                {!lead.inspection?.scheduledAt && !showInspectionForm && (
                    <div className="text-center py-8 space-y-3 border border-dashed border-border rounded-xl">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">No Inspection Scheduled</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          There are no active inspections booked for this client yet.
                        </p>
                      </div>
                    </div>
                )}

                {/* Schedule / Reschedule Form */}
                {showInspectionForm && (
                    <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {isRescheduling ? "Reschedule Inspection" : "Schedule New Inspection"}
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => {
                              setShowInspectionForm(false);
                              setIsRescheduling(false);
                              resetInspectionForm();
                            }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {formError && (
                          <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {formError}
                          </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Date</Label>
                          <Input
                              type="date"
                              className="h-9 text-xs rounded-lg"
                              value={inspectionDatePart}
                              onChange={(e) => setInspectionDatePart(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Time</Label>
                          <Input
                              type="time"
                              className="h-9 text-xs rounded-lg"
                              value={inspectionTimePart}
                              onChange={(e) => setInspectionTimePart(e.target.value)}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold">Location / Venue</Label>
                          <Input
                              className="h-9 text-xs rounded-lg"
                              placeholder="e.g. On-site property location"
                              value={inspectionLocation}
                              onChange={(e) => setInspectionLocation(e.target.value)}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold">Inspection Notes (Optional)</Label>
                          <Textarea
                              className="text-xs rounded-lg min-h-[80px]"
                              placeholder="Add details, instructions, or specific client requests..."
                              value={inspectionNotes}
                              onChange={(e) => setInspectionNotes(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-border">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-medium"
                            onClick={() => {
                              setShowInspectionForm(false);
                              setIsRescheduling(false);
                              resetInspectionForm();
                            }}
                        >
                          Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={scheduling || rescheduling}
                            onClick={handleSubmitInspection}
                            className="h-8 text-xs font-semibold"
                        >
                          {scheduling || rescheduling
                              ? "Saving..."
                              : isRescheduling
                                  ? "Update Inspection"
                                  : "Confirm Booking"}
                        </Button>
                      </div>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab Content */}
          <TabsContent value="activities" className="space-y-6 mt-0">
            <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
              <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">
                  Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {lead.activities && lead.activities.length > 0 ? (
                    <div className="space-y-4">
                      {lead.activities.map((act, idx) => (
                          <div key={idx} className="p-3 border border-border rounded-lg bg-muted/10 space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="font-semibold text-foreground">{act.createdBy}</span>
                              <span>{formatDate(act.createdAt)}</span>
                            </div>
                            <p className="text-xs text-foreground/90">{act.note}</p>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-6">
                      No activity history logged for this lead yet.
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}

// "use client";
// import { Textarea } from "@/components/ui/textarea";
// import { use, useState, useCallback, useMemo, ChangeEvent, MouseEvent } from "react";
// import Link from "next/link";
// import { useQuery, useMutation } from "@apollo/client/react";
// import {
//   ArrowLeft,
//   Phone,
//   Mail,
//   Calendar,
//   Edit,
//   Save,
//   X,
//   Building2,
//   MapPin,
//   Bed,
//   Bath,
//   Ruler,
//   Clock,
//   User,
//   Plus,
//   ExternalLink,
//   CheckCircle2,
//   AlertCircle,
// } from "lucide-react";
//
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// // import { Input } from "@/dashboard/components/ui/input";
// import { Input, Label } from "@/dashboard/components/ui/input";
// import { Can } from "@/dashboard/components/auth/can";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   LEAD_DETAIL_QUERY,
//   PROPERTY_DETAIL_QUERY,
//   SCHEDULE_INSPECTION_MUTATION,
//   UPDATE_LEAD_MUTATION,
// } from "@/dashboard/lib/graphql/documents";
//
// // ============================================================================
// // Types
// // ============================================================================
//
// export type LeadStage =
//     | "NEW"
//     | "CONTACTED"
//     | "INSPECTION_BOOKED"
//     | "NEGOTIATION"
//     | "CLOSED_WON"
//     | "CLOSED_LOST";
//
// export interface Activity {
//   note: string;
//   createdBy: string;
//   createdAt: string;
// }
//
// export interface Inspection {
//   scheduledAt: string | null;
//   location: string | null;
//   notes: string | null;
//   completed: boolean;
// }
//
// export interface Lead {
//   id: string;
//   clientName: string | null;
//   clientPhone: string | null;
//   clientEmail: string | null;
//   property: string | null;
//   assignedAgent: string | null;
//   stage: LeadStage | null;
//   activities: Activity[];
//   inspection: Inspection | null;
//   createdAt: string;
//   updatedAt: string;
// }
//
// export interface LeadDetailData {
//   lead: Lead | null;
// }
//
// export interface LeadDetailVariables {
//   leadId: string;
// }
//
// export interface UpdateLeadInput {
//   clientName?: string | null;
//   clientPhone?: string | null;
//   clientEmail?: string | null;
//   property?: string | null;
//   stage?: LeadStage | null;
// }
//
// export interface UpdateLeadData {
//   updateLead: Lead;
// }
//
// export interface UpdateLeadVariables {
//   updateLeadId: string;
//   input: UpdateLeadInput;
// }
//
// export interface ScheduleInspectionInput {
//   scheduledAt: string;
//   location: string;
//   notes?: string | null;
//   stage: LeadStage;
// }
//
// export interface ScheduleInspectionData {
//   scheduleInspection: Lead;
// }
//
// export interface ScheduleInspectionVariables {
//   scheduleInspectionId: string;
//   input: ScheduleInspectionInput;
// }
//
// interface EditFormState {
//   clientName: string;
//   clientPhone: string;
//   clientEmail: string;
//   property: string;
//   stage: LeadStage | "";
// }
//
// // ============================================================================
// // Constants & Helpers
// // ============================================================================
//
// const STAGES: ReadonlyArray<{ key: LeadStage; label: string; color: string }> = [
//   { key: "NEW", label: "New", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
//   { key: "CONTACTED", label: "Contacted", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
//   { key: "INSPECTION_BOOKED", label: "Inspection Booked", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
//   { key: "NEGOTIATION", label: "Negotiation", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
//   { key: "CLOSED_WON", label: "Closed Won", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
//   { key: "CLOSED_LOST", label: "Closed Lost", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
// ] as const;
//
// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(amount ?? 0);
// }
//
// function formatInspectionDate(dateString: string | null | undefined): string {
//   if (!dateString) return "";
//   const num = Number(dateString);
//   const parsed = new Date(!isNaN(num) && dateString.trim() !== "" ? num : dateString);
//
//   if (isNaN(parsed.getTime())) return dateString;
//
//   return parsed.toLocaleString("en-US", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }
//
// function formatDate(dateString: string | null | undefined): string {
//   if (!dateString) return "";
//   const num = Number(dateString);
//   const parsed = new Date(!isNaN(num) && dateString.trim() !== "" ? num : dateString);
//
//   if (isNaN(parsed.getTime())) return dateString;
//
//   return parsed.toLocaleDateString("en-US", {
//     dateStyle: "medium",
//   });
// }
//
// // ============================================================================
// // Main Lead Detail Component
// // ============================================================================
//
// export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//
//   // Form & UI States
//   const [formError, setFormError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showInspectionForm, setShowInspectionForm] = useState(false);
//
//   const [editForm, setEditForm] = useState<EditFormState>({
//     clientName: "",
//     clientPhone: "",
//     clientEmail: "",
//     property: "",
//     stage: "",
//   });
//
//   const [inspectionDatePart, setInspectionDatePart] = useState("");
//   const [inspectionTimePart, setInspectionTimePart] = useState("09:00");
//   const [inspectionLocation, setInspectionLocation] = useState("");
//   const [inspectionNotes, setInspectionNotes] = useState("");
//
//   const inspectionDate = useMemo(() => {
//     if (!inspectionDatePart) return "";
//     return `${inspectionDatePart}T${inspectionTimePart || "00:00"}`;
//   }, [inspectionDatePart, inspectionTimePart]);
//
//   // Fetch Lead Detail Query
//   const { data, loading } = useQuery<LeadDetailData, LeadDetailVariables>(LEAD_DETAIL_QUERY, {
//     variables: { leadId: id },
//   });
//
//   const lead = data?.lead;
//
//   // Fetch Associated Property Data dynamically using lead.property ID
//   const { data: propertyData, loading: loadingProperty } = useQuery<any>(
//       PROPERTY_DETAIL_QUERY,
//       {
//         variables: { propertyId: lead?.property || "" },
//         skip: !lead?.property,
//       }
//   );
//
//   const property = propertyData?.property;
//
//   // Apollo Mutations with Cache Updates
//   const [updateLead, { loading: updating }] = useMutation<UpdateLeadData, UpdateLeadVariables>(
//       UPDATE_LEAD_MUTATION,
//       {
//         onCompleted: () => {
//           setIsEditing(false);
//         },
//         update: (cache, { data: mutationData }) => {
//           if (!mutationData?.updateLead) return;
//           cache.writeQuery<LeadDetailData, LeadDetailVariables>({
//             query: LEAD_DETAIL_QUERY,
//             variables: { leadId: id },
//             data: { lead: mutationData.updateLead },
//           });
//         },
//       }
//   );
//
//   const [scheduleInspection, { loading: scheduling }] = useMutation<
//       ScheduleInspectionData,
//       ScheduleInspectionVariables
//   >(SCHEDULE_INSPECTION_MUTATION, {
//     onCompleted: () => {
//       setShowInspectionForm(false);
//       setInspectionDatePart("");
//       setInspectionTimePart("09:00");
//       setInspectionLocation("");
//       setInspectionNotes("");
//       setFormError(null);
//     },
//     onError: (err) => {
//       console.error("GraphQL Error:", err);
//       setFormError(err.message || "Failed to schedule inspection. Please try again.");
//     },
//     update: (cache, { data: mutationData }) => {
//       if (!mutationData?.scheduleInspection) return;
//       cache.writeQuery<LeadDetailData, LeadDetailVariables>({
//         query: LEAD_DETAIL_QUERY,
//         variables: { leadId: id },
//         data: { lead: mutationData.scheduleInspection },
//       });
//     },
//   });
//
//   // Event Handlers
//   const startEditing = useCallback(() => {
//     if (!lead) return;
//     setEditForm({
//       clientName: lead.clientName || "",
//       clientPhone: lead.clientPhone || "",
//       clientEmail: lead.clientEmail || "",
//       property: lead.property || "",
//       stage: lead.stage || "NEW",
//     });
//     setIsEditing(true);
//   }, [lead]);
//
//   const handleUpdateLead = useCallback(async () => {
//     try {
//       await updateLead({
//         variables: {
//           updateLeadId: id,
//           input: {
//             clientName: editForm.clientName || null,
//             clientPhone: editForm.clientPhone || null,
//             clientEmail: editForm.clientEmail || null,
//             property: editForm.property || null,
//             stage: (editForm.stage as LeadStage) || null,
//           },
//         },
//       });
//     } catch (error) {
//       console.error("Failed to update lead:", error);
//     }
//   }, [id, editForm, updateLead]);
//
//   const handleScheduleInspection = useCallback(
//       async (e: MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         setFormError(null);
//
//         if (!inspectionDate) {
//           setFormError("Please select a date and time for the inspection.");
//           return;
//         }
//
//         if (!inspectionLocation.trim()) {
//           setFormError("Please enter an inspection location.");
//           return;
//         }
//
//         const parsedDate = new Date(inspectionDate);
//         if (isNaN(parsedDate.getTime())) {
//           setFormError("Invalid date format. Please re-select the date.");
//           return;
//         }
//
//         try {
//           await scheduleInspection({
//             variables: {
//               scheduleInspectionId: id,
//               input: {
//                 scheduledAt: parsedDate.toISOString(),
//                 location: inspectionLocation.trim(),
//                 notes: inspectionNotes.trim() ? inspectionNotes.trim() : null,
//                 stage: "INSPECTION_BOOKED",
//               },
//             },
//           });
//         } catch {
//           // Error state handled in mutation onError hook
//         }
//       },
//       [id, inspectionDate, inspectionLocation, inspectionNotes, scheduleInspection]
//   );
//
//   const currentStageConfig = useMemo(() => {
//     return STAGES.find((s) => s.key === lead?.stage) ?? {
//       key: "NEW",
//       label: lead?.stage ?? "New",
//       color: "bg-secondary text-foreground",
//     };
//   }, [lead?.stage]);
//
//   const formattedInspectionDate = useMemo(() => {
//     return formatInspectionDate(lead?.inspection?.scheduledAt);
//   }, [lead?.inspection?.scheduledAt]);
//
//   if (loading) {
//     return (
//         <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
//           <div className="h-4 w-32 bg-muted rounded animate-pulse" />
//           <div className="h-48 bg-muted rounded-xl animate-pulse" />
//           <div className="h-64 bg-muted rounded-xl animate-pulse" />
//         </div>
//     );
//   }
//
//   if (!lead) {
//     return (
//         <div className="max-w-5xl mx-auto space-y-4 px-4 py-8">
//           <Link
//               href="/account/leads"
//               className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <ArrowLeft className="h-3.5 w-3.5" />
//             Back to leads
//           </Link>
//           <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
//             Lead record not found or has been removed.
//           </div>
//         </div>
//     );
//   }
//
//   return (
//       <div className="max-w-8xl mx-auto space-y-6 px-4 sm:px-6 py-6">
//         {/* Navigation & Header */}
//         <div className="flex items-center justify-between">
//           <Link
//               href="/account/leads"
//               className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
//           >
//             <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
//             Back to leads
//           </Link>
//           <span className="text-xs text-muted-foreground font-mono">
//           Created {formatDate(lead.createdAt)}
//         </span>
//         </div>
//
//         {/* Main Lead Summary Card */}
//         <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
//           <CardContent className="p-6">
//             {!isEditing ? (
//                 <div className="space-y-6">
//                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-3">
//                         <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
//                           {lead.clientName || "Unnamed Lead"}
//                         </h1>
//                         <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 border ${currentStageConfig.color}`}>
//                           {currentStageConfig.label}
//                         </Badge>
//                       </div>
//                       <p className="text-xs text-muted-foreground flex items-center gap-1.5">
//                         <User className="h-3.5 w-3.5" /> Lead ID: <span className="font-mono">{lead.id}</span>
//                       </p>
//                     </div>
//
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={startEditing}
//                         className="h-9 px-3 text-xs font-semibold self-start shrink-0"
//                     >
//                       <Edit className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
//                       Edit Details
//                     </Button>
//                   </div>
//
//                   {/* Quick Contact Info */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
//                     <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
//                       <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
//                       <div className="truncate">
//                         <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Phone</span>
//                         {lead.clientPhone ? (
//                             <a href={`tel:${lead.clientPhone}`} className="text-foreground hover:text-primary transition-colors font-mono">
//                               {lead.clientPhone}
//                             </a>
//                         ) : (
//                             <span className="text-muted-foreground/60 italic">Not provided</span>
//                         )}
//                       </div>
//                     </div>
//
//                     <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
//                       <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
//                       <div className="truncate">
//                         <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Email</span>
//                         {lead.clientEmail ? (
//                             <a href={`mailto:${lead.clientEmail}`} className="text-foreground hover:text-primary transition-colors font-mono truncate block">
//                               {lead.clientEmail}
//                             </a>
//                         ) : (
//                             <span className="text-muted-foreground/60 italic">Not provided</span>
//                         )}
//                       </div>
//                     </div>
//
//                     <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
//                       <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
//                       <div className="truncate">
//                         <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Property ID</span>
//                         <span className="text-foreground font-mono truncate block">{lead.property || "—"}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//             ) : (
//                 /* Inline Edit Lead Form */
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between border-b border-border pb-3">
//                     <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
//                       Edit Lead Details
//                     </h2>
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-7 w-7 rounded-lg"
//                         onClick={() => setIsEditing(false)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-1.5">
//                       <Label className="text-xs font-semibold">Client Name</Label>
//                       <Input
//                           className="h-9 text-xs rounded-lg"
//                           value={editForm.clientName}
//                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               setEditForm((prev) => ({ ...prev, clientName: e.target.value }))
//                           }
//                       />
//                     </div>
//
//                     <div className="space-y-1.5">
//                       <Label className="text-xs font-semibold">Pipeline Stage</Label>
//                       <Select
//                           value={editForm.stage}
//                           onValueChange={(val: LeadStage) =>
//                               setEditForm((prev) => ({ ...prev, stage: val }))
//                           }
//                       >
//                         <SelectTrigger className="h-9 text-xs rounded-lg">
//                           <SelectValue placeholder="Select Stage" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {STAGES.map((s) => (
//                               <SelectItem key={s.key} value={s.key} className="text-xs font-medium">
//                                 {s.label}
//                               </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//
//                     <div className="space-y-1.5">
//                       <Label className="text-xs font-semibold">Phone Number</Label>
//                       <Input
//                           className="h-9 text-xs font-mono rounded-lg"
//                           value={editForm.clientPhone}
//                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               setEditForm((prev) => ({ ...prev, clientPhone: e.target.value }))
//                           }
//                       />
//                     </div>
//
//                     <div className="space-y-1.5">
//                       <Label className="text-xs font-semibold">Email Address</Label>
//                       <Input
//                           className="h-9 text-xs font-mono rounded-lg"
//                           value={editForm.clientEmail}
//                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               setEditForm((prev) => ({ ...prev, clientEmail: e.target.value }))
//                           }
//                       />
//                     </div>
//
//                     <div className="sm:col-span-2 space-y-1.5">
//                       <Label className="text-xs font-semibold">Associated Property ID</Label>
//                       <Input
//                           className="h-9 text-xs font-mono rounded-lg"
//                           value={editForm.property} disabled
//                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               setEditForm((prev) => ({ ...prev, property: e.target.value }))
//                           }
//                       />
//                     </div>
//                   </div>
//
//                   <div className="flex justify-end gap-2 pt-3 border-t border-border">
//                     <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8 text-xs font-medium">
//                       Cancel
//                     </Button>
//                     <Button size="sm" disabled={updating} onClick={handleUpdateLead} className="h-8 text-xs font-semibold">
//                       <Save className="h-3.5 w-3.5 mr-1.5" />
//                       {updating ? "Saving..." : "Save Changes"}
//                     </Button>
//                   </div>
//                 </div>
//             )}
//           </CardContent>
//         </Card>
//
//         {/* Tabs View Section */}
//         <Tabs defaultValue="overview" className="space-y-8">
//           <TabsList className="bg-muted/50 py-1  border border-border rounded-lg grid grid-cols-3 w-full sm:w-[400px]">
//             <TabsTrigger value="overview" className="text-xs font-semibold rounded-md px-4">Overview & Property</TabsTrigger>
//             <TabsTrigger value="inspection" className="text-xs font-semibold rounded-md px-4">Inspection</TabsTrigger>
//             <TabsTrigger value="activities" className="text-xs font-semibold rounded-md px-4">Activities ({lead.activities?.length ?? 0})</TabsTrigger>
//           </TabsList>
//
//           {/* Overview Tab Content */}
//           <TabsContent value="overview" className="space-y-6 mt-0">
//             {/* Associated Property Section */}
//             <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
//               <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Building2 className="h-4 w-4 text-primary" />
//                     <CardTitle className="text-base font-bold text-foreground">
//                       Interested Property Details
//                     </CardTitle>
//                   </div>
//                   {property && (
//                       <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground">
//                         <Link href={`/account/property/${property.id || property._id}`} className="flex items-center gap-1">
//                           View Full Listing
//                           <ExternalLink className="h-3 w-3" />
//                         </Link>
//                       </Button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent className="p-6">
//                 {loadingProperty ? (
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground animate-pulse py-4">
//                       <Building2 className="h-5 w-5" />
//                       Loading associated property information…
//                     </div>
//                 ) : property ? (
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
//                       {/* Property Image Preview */}
//                       {property.images?.[0]?.url && (
//                           <div className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted relative">
//                             <img
//                                 src={property.images[0].url}
//                                 alt={property.title}
//                                 className="w-full h-full object-cover"
//                             />
//                             {property.status && (
//                                 <Badge className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm text-white">
//                                   {property.status}
//                                 </Badge>
//                             )}
//                           </div>
//                       )}
//
//                       {/* Property Quick Info */}
//                       <div className={property.images?.[0]?.url ? "md:col-span-8 space-y-3" : "md:col-span-12 space-y-3"}>
//                         <div>
//                           <h3 className="text-base font-bold text-foreground">
//                             {property.title || property.name || "Untitled Property"}
//                           </h3>
//                           {property.address && (
//                               <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                                 <MapPin className="h-3.5 w-3.5 shrink-0" />
//                                 {property.address}
//                               </p>
//                           )}
//                         </div>
//
//                         <div className="text-lg font-bold font-mono text-primary">
//                           {property.price ? formatCurrency(property.price) : "Price on Request"}
//                         </div>
//
//                         <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border/60">
//                           {property.bedrooms && (
//                               <span className="flex items-center gap-1.5">
//                           <Bed className="h-4 w-4 text-foreground/70" />
//                                 {property.bedrooms} Beds
//                         </span>
//                           )}
//                           {property.bathrooms && (
//                               <span className="flex items-center gap-1.5">
//                           <Bath className="h-4 w-4 text-foreground/70" />
//                                 {property.bathrooms} Baths
//                         </span>
//                           )}
//                           {property.size && (
//                               <span className="flex items-center gap-1.5">
//                           <Ruler className="h-4 w-4 text-foreground/70" />
//                                 {property.size} sqft
//                         </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                 ) : lead.property ? (
//                     <div className="text-xs text-muted-foreground italic py-2">
//                       Property ID <span className="font-mono font-medium">{lead.property}</span> is linked to this lead, but details could not be retrieved.
//                     </div>
//                 ) : (
//                     <div className="text-xs text-muted-foreground italic py-2">
//                       No property is currently attached to this lead.
//                     </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* Inspection Tab Content */}
//           <TabsContent value="inspection" className="space-y-6 mt-0">
//             <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
//               <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-primary" />
//                     <CardTitle className="text-base font-bold text-foreground">
//                       Property Inspection Status
//                     </CardTitle>
//                   </div>
//                   <Can do="scheduleInspections">
//                     {!showInspectionForm && (
//                         <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => {
//                               setFormError(null);
//                               setShowInspectionForm(true);
//                             }}
//                             className="h-8 text-xs font-semibold"
//                         >
//                           <Plus className="h-3.5 w-3.5 mr-1" />
//                           Schedule Inspection
//                         </Button>
//                     )}
//                   </Can>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-6 space-y-6">
//                 {/* Existing Inspection Banner */}
//                 {lead.inspection?.scheduledAt ? (
//                     <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
//                           <CheckCircle2 className="h-5 w-5 shrink-0" />
//                           Inspection Active
//                         </div>
//                         {lead.inspection.completed && (
//                             <Badge className="bg-emerald-600 text-white text-[10px]">Completed</Badge>
//                         )}
//                       </div>
//
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-foreground font-medium border-t border-emerald-500/20">
//                         <div>
//                           <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-0.5">Scheduled Date & Time</span>
//                           <span className="font-mono text-sm">{formattedInspectionDate}</span>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-0.5">Location</span>
//                           <span>{lead.inspection.location || "Property Location"}</span>
//                         </div>
//                       </div>
//
//                       {lead.inspection.notes && (
//                           <div className="pt-2 text-xs text-muted-foreground border-t border-emerald-500/20">
//                             <span className="font-semibold text-foreground">Notes: </span>
//                             {lead.inspection.notes}
//                           </div>
//                       )}
//                     </div>
//                 ) : (
//                     !showInspectionForm && (
//                         <div className="text-center py-8 space-y-3 border border-dashed border-border rounded-xl">
//                           <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
//                           <div className="space-y-1">
//                             <p className="text-sm font-semibold text-foreground">No Inspection Scheduled</p>
//                             <p className="text-xs text-muted-foreground max-w-sm mx-auto">
//                               There are no active inspections booked for this client yet.
//                             </p>
//                           </div>
//                         </div>
//                     )
//                 )}
//
//                 {/* Schedule Inspection Form */}
//                 {showInspectionForm && (
//                     <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
//                       <div className="flex items-center justify-between border-b border-border/60 pb-3">
//                         <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
//                           <Calendar className="h-3.5 w-3.5 text-primary" />
//                           Schedule New Inspection
//                         </h3>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-6 w-6 rounded-lg"
//                             onClick={() => setShowInspectionForm(false)}
//                         >
//                           <X className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//
//                       {formError && (
//                           <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
//                             <AlertCircle className="h-4 w-4 shrink-0" />
//                             <span>{formError}</span>
//                           </div>
//                       )}
//
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-1.5">
//                           <Label className="text-xs font-semibold">Date &amp; Time <span className="text-destructive">*</span></Label>
//                           <div className="grid grid-cols-2 gap-2">
//                             <Input
//                                 type="date"
//                                 className="text-xs h-12 rounded-lg"
//                                 value={inspectionDatePart}
//                                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                                   setFormError(null);
//                                   setInspectionDatePart(e.target.value);
//                                 }}
//                             />
//                             <Input
//                                 type="time"
//                                 className="text-xs h-12 rounded-lg"
//                                 value={inspectionTimePart}
//                                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                                   setFormError(null);
//                                   setInspectionTimePart(e.target.value);
//                                 }}
//                             />
//                           </div>
//                         </div>
//
//                         <div className="space-y-1.5">
//                           <Label htmlFor="inspectionLocation" className="text-xs font-semibold">
//                             Inspection Address <span className="text-destructive">*</span>
//                           </Label>
//                           <Input
//                               id="inspectionLocation"
//                               value={inspectionLocation}
//                               onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                                 setFormError(null);
//                                 setInspectionLocation(e.target.value);
//                               }}
//                               placeholder="Property address"
//                               className="text-xs h-12 rounded-lg"
//                           />
//                         </div>
//                       </div>
//
//                       <div className="space-y-1.5">
//                         <Label htmlFor="inspectionNotes" className="text-xs font-semibold">
//                           Inspection Notes
//                         </Label>
//                         <Textarea
//                             id="inspectionNotes"
//                             value={inspectionNotes}
//                             onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInspectionNotes(e.target.value)}
//                             placeholder="Additional details, meeting point, or client requirements..."
//                             className="text-xs min-h-[80px] rounded-lg resize-none"
//                         />
//                       </div>
//
//                       <div className="flex justify-end gap-2 pt-2 border-t border-border">
//                         <Button
//                             type="button"
//                             size="sm"
//                             variant="outline"
//                             onClick={() => {
//                               setShowInspectionForm(false);
//                               setFormError(null);
//                             }}
//                             className="h-8 text-xs font-medium"
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                             type="button"
//                             size="sm"
//                             disabled={scheduling}
//                             onClick={handleScheduleInspection}
//                             className="h-8 text-xs font-semibold"
//                         >
//                           {scheduling ? "Scheduling..." : "Confirm Inspection"}
//                         </Button>
//                       </div>
//                     </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* Activities Log Tab Content */}
//           <TabsContent value="activities" className="space-y-6 mt-0">
//             <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
//               <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
//                 <CardTitle className="text-base font-bold text-foreground">
//                   Activity Timeline
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 {lead.activities && lead.activities.length > 0 ? (
//                     <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
//                       {lead.activities.map((act, index) => (
//                           <div key={index} className="relative group">
//                             <div className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary ring-4 ring-background" />
//                             <div className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-1">
//                               <div className="flex items-center justify-between text-[11px] text-muted-foreground">
//                                 <span className="font-semibold text-foreground">{act.createdBy || "System Agent"}</span>
//                                 <span className="font-mono flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                                   {formatDate(act.createdAt)}
//                           </span>
//                               </div>
//                               <p className="text-xs text-foreground font-medium">{act.note}</p>
//                             </div>
//                           </div>
//                       ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
//                       No activity logs recorded for this lead yet.
//                     </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//   );
// }

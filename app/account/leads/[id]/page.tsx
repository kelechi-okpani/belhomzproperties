"use client";
import { use, useState, useCallback, useMemo, ChangeEvent, MouseEvent } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, Phone, Mail, Calendar, Edit, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  LEAD_DETAIL_QUERY,
  SCHEDULE_INSPECTION_MUTATION,
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

const STAGES: ReadonlyArray<{ key: LeadStage; label: string }> = [
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "INSPECTION_BOOKED", label: "Inspection Booked" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "CLOSED_WON", label: "Closed Won" },
  { key: "CLOSED_LOST", label: "Closed Lost" },
] as const;

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

// ============================================================================
// Component
// ============================================================================

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Form & UI States
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);

  const [editForm, setEditForm] = useState<EditFormState>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    property: "",
    stage: "",
  });
// 1. Separate state for date and time parts
  const [inspectionDatePart, setInspectionDatePart] = useState("");
  const [inspectionTimePart, setInspectionTimePart] = useState("09:00"); // Default to 9:00 AM
// 2. Derive combined inspectionDate for your mutation logic
  const inspectionDate = useMemo(() => {
    if (!inspectionDatePart) return "";
    return `${inspectionDatePart}T${inspectionTimePart || "00:00"}`;
  }, [inspectionDatePart, inspectionTimePart]);
  const [inspectionLocation, setInspectionLocation] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  // Apollo Query
  const { data, loading } = useQuery<LeadDetailData, LeadDetailVariables>(LEAD_DETAIL_QUERY, {
    variables: { leadId: id },
  });

  // Apollo Mutations with Direct Cache Invalidation/Updates
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
      setInspectionDatePart("");
      setInspectionTimePart("09:00");
      setInspectionLocation("");
      setInspectionNotes("");
      setFormError(null);
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

  const lead = data?.lead;

  // Handlers
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

  const handleScheduleInspection = useCallback(
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
        } catch {
          // Error state handled in mutation onError hook
        }
      },
      [id, inspectionDate, inspectionLocation, inspectionNotes, scheduleInspection]
  );

  const formattedStage = useMemo(() => {
    if (!lead?.stage) return "No Stage";
    return lead.stage.replace(/_/g, " ").toLowerCase();
  }, [lead?.stage]);

  const formattedInspectionDate = useMemo(() => {
    return formatInspectionDate(lead?.inspection?.scheduledAt);
  }, [lead?.inspection?.scheduledAt]);

  if (loading) {
    return (
        <div className="max-w-3xl mx-auto py-8">
          <p className="text-sm text-[var(--color-ink-muted)] animate-pulse">Loading lead details…</p>
        </div>
    );
  }

  if (!lead) {
    return (
        <div className="max-w-3xl mx-auto space-y-4 py-8">
          <Link
              href="/account/leads"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to leads
          </Link>
          <p className="text-sm text-[var(--color-danger)] font-medium">Lead not found or has been deleted.</p>
        </div>
    );
  }

  return (
      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-0">
        <Link
            href="/account/leads"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>

        {/* Main Details Card */}
        <Card className="rounded-xl border border-[var(--color-border)] shadow-sm">
          <CardContent className="p-4 sm:p-6">
            {!isEditing ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                        {lead.clientName || "Unnamed Client"}
                      </h1>
                      <Badge className="mt-2 font-mono text-xs capitalize bg-[var(--color-paper-raised)] text-[var(--color-ink)] border border-[var(--color-border)]">
                        {formattedStage}
                      </Badge>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditing}
                        className="h-8 text-xs font-medium self-start cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit Details
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-[var(--color-ink-muted)] pt-3 border-t border-[var(--color-border)]">
                    {lead.clientPhone && (
                        <a
                            href={`tel:${lead.clientPhone}`}
                            className="flex items-center gap-2 hover:text-[var(--color-brass)] transition-colors"
                        >
                          <Phone className="h-4 w-4 shrink-0" />
                          <span className="font-mono">{lead.clientPhone}</span>
                        </a>
                    )}
                    {lead.clientEmail && (
                        <a
                            href={`mailto:${lead.clientEmail}`}
                            className="flex items-center gap-2 hover:text-[var(--color-brass)] transition-colors truncate"
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="font-mono truncate">{lead.clientEmail}</span>
                        </a>
                    )}
                    {lead.property && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-ink)]">Property:</span>
                          <span>{lead.property}</span>
                        </div>
                    )}
                  </div>
                </>
            ) : (
                /* Update Lead Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                      Edit Lead Details
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer"
                        onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Client Name</Label>
                      <Input
                          className="mt-1 text-xs"
                          value={editForm.clientName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientName: e.target.value }))
                          }
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Stage</Label>
                      <Select
                          value={editForm.stage}
                          onValueChange={(val: LeadStage) =>
                              setEditForm((prev) => ({ ...prev, stage: val }))
                          }
                      >
                        <SelectTrigger className="mt-1 h-9 text-xs">
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                              <SelectItem key={s.key} value={s.key} className="text-xs">
                                {s.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Phone</Label>
                      <Input
                          className="mt-1 text-xs"
                          value={editForm.clientPhone}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientPhone: e.target.value }))
                          }
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Email</Label>
                      <Input
                          className="mt-1 text-xs"
                          value={editForm.clientEmail}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, clientEmail: e.target.value }))
                          }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium">Property</Label>
                      <Input
                          className="mt-1 text-xs"
                          value={editForm.property}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditForm((prev) => ({ ...prev, property: e.target.value }))
                          }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 text-xs">
                      Cancel
                    </Button>
                    <Button size="sm" variant="default" disabled={updating} onClick={handleUpdateLead} className="h-8 text-xs">
                      <Save className="h-3.5 w-3.5 mr-1" />
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
            )}

            {/* Inspection Active Banner */}
            {lead.inspection?.scheduledAt && (
                <div className="mt-4 flex items-start sm:items-center gap-2.5 rounded-lg bg-[var(--color-brass-soft)]/20 border border-[var(--color-brass-soft)] p-3 text-xs sm:text-sm text-[var(--color-brass-dark)]">
                  <Calendar className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-semibold">Inspection Scheduled:</span>{" "}
                    {lead.inspection.location ? `${lead.inspection.location} — ` : ""}
                    {formattedInspectionDate}
                  </div>
                </div>
            )}

            {/* Schedule Inspection Form */}
            <Can do="scheduleInspections">
              <div className="mt-5">
                {!showInspectionForm ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormError(null);
                          setShowInspectionForm(true);
                        }}
                        className="w-full sm:w-auto h-9 text-xs font-semibold cursor-pointer"
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Schedule inspection
                    </Button>
                ) : (
                    <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-paper-raised)]/30 p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                        New Inspection
                      </h3>

                      {formError && (
                          <div className="text-xs font-medium text-[var(--color-danger,red)] bg-red-500/10 p-2 rounded border border-red-500/20">
                            {formError}
                          </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Date & Time Picker Group */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Date &amp; Time</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Date Picker */}
                            <Input
                                type="date"
                                className="text-xs h-9"
                                value={inspectionDatePart}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setFormError(null);
                                  setInspectionDatePart(e.target.value);
                                }}
                            />
                            {/* Time Picker */}
                            <Input
                                type="time"
                                className="text-xs h-9"
                                value={inspectionTimePart}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setFormError(null);
                                  setInspectionTimePart(e.target.value);
                                }}
                            />
                          </div>
                        </div>

                        {/* Location Input */}
                        <div>
                          <Label htmlFor="inspectionLocation" className="text-xs font-medium">
                            Location
                          </Label>
                          <Input
                              id="inspectionLocation"
                              value={inspectionLocation}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setFormError(null);
                                setInspectionLocation(e.target.value);
                              }}
                              placeholder="Property address"
                              className="mt-1 text-xs h-9"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="inspectionNotes" className="text-xs font-medium">
                          Inspection Notes
                        </Label>
                        <Input
                            id="inspectionNotes"
                            value={inspectionNotes}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setInspectionNotes(e.target.value)}
                            placeholder="Additional inspection details..."
                            className="mt-1 text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowInspectionForm(false);
                              setFormError(null);
                            }}
                            className="h-8 text-xs cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="default"
                            disabled={scheduling}
                            onClick={handleScheduleInspection}
                            className="h-8 text-xs cursor-pointer"
                        >
                          {scheduling ? "Scheduling..." : "Confirm Inspection"}
                        </Button>
                      </div>
                    </div>
                )}
              </div>
            </Can>
          </CardContent>
        </Card>
      </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Edit, Calendar, Phone, Home, GripVertical } from "lucide-react";
import { LEADS_QUERY, UPDATE_LEAD_STAGE } from "@/dashboard/lib/graphql/documents";
import { Button } from "@/components/ui/button";
import { Can } from "@/dashboard/components/auth/can";
import { can } from "@/dashboard/lib/permissions";
import { useAuthStore } from "@/dashboard/store/auth-store";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPagination } from "@/dashboard/components/ui/pagination";

const STAGES = [
  { key: "NEW", label: "New", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { key: "CONTACTED", label: "Contacted", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { key: "INSPECTION_BOOKED", label: "Inspection Booked", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  { key: "CLOSED_WON", label: "Closed Won", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { key: "CLOSED_LOST", label: "Closed Lost", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
] as const;

const RESTRICTED_PAST_INSPECTION = ["NEW", "CONTACTED"];
const AT_OR_PAST_INSPECTION = [
  "INSPECTION_BOOKED",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const role = useAuthStore((s) => s.user?.role);
  const canChangeStage = can(role, "changeLeadStage");
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(LEADS_QUERY, {
    variables: {
      filter: {},
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
    fetchPolicy: "cache-and-network",
  });

  const [updateLeadStage] = useMutation<any>(UPDATE_LEAD_STAGE, {
    onCompleted: () => refetch(),
  });

  const leads = data?.leads?.items ?? data?.leads ?? [];
  const leadsByStage = (stage: string) =>
      leads.filter((l: any) => l.stage === stage);

  const totalItems = data?.leads?.totalCount ?? leads.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const isInspectionScheduled = (lead: any) => {
    return (
        Boolean(lead.inspection?.scheduledAt) ||
        AT_OR_PAST_INSPECTION.includes(lead.stage)
    );
  };

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      await updateLeadStage({
        variables: {
          updateLeadStageId: leadId,
          stage: newStage,
        },
      });
    } catch (error) {
      console.error("Failed to update lead stage:", error);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!canChangeStage) return;

    const leadId = e.dataTransfer.getData("text/lead-id");
    if (!leadId) return;

    const lead = leads.find((l: any) => (l.id || l._id) === leadId);
    if (!lead) return;

    if (
        isInspectionScheduled(lead) &&
        RESTRICTED_PAST_INSPECTION.includes(targetStage)
    ) {
      return;
    }

    await handleStageChange(leadId, targetStage);
  };

  const formatDate = (rawDate: string | number | undefined | null) => {
    if (!rawDate) return null;
    const timestamp = typeof rawDate === "string" ? Number(rawDate) : rawDate;
    const parsed = new Date(isNaN(timestamp) ? rawDate : timestamp);

    return !isNaN(parsed.getTime())
        ? parsed.toLocaleDateString(undefined, {
          dateStyle: "medium",
        })
        : null;
  };

  const getStageColor = (stageKey: string) => {
    return STAGES.find((s) => s.key === stageKey)?.color ?? "bg-secondary text-foreground";
  };

  return (
      <div className="space-y-8 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Client Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading
                  ? "Loading leads..."
                  : `${totalItems} total lead${totalItems === 1 ? "" : "s"} across all pipeline stages`}
            </p>
          </div>
          <Can do="createLeads">
            <Button asChild variant="default" size="sm" className="h-10 px-4 font-medium shadow-sm">
              <Link href="/account/leads/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Lead
              </Link>
            </Button>
          </Can>
        </div>

        {/* Stage Summary Cards / Drag Targets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map(({ key, label }) => {
            const stageCount = leadsByStage(key).length;
            const percentage = leads.length
                ? Math.round((stageCount / leads.length) * 100)
                : 0;
            const isDraggingOver = dragOverStage === key;

            return (
                <div
                    key={key}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverStage(key);
                    }}
                    onDragLeave={() => setDragOverStage(null)}
                    onDrop={(e) => handleDrop(e, key)}
                    className={cn(
                        "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-200 shadow-sm hover:border-primary/40",
                        isDraggingOver &&
                        "ring-2 ring-primary border-dashed border-primary bg-primary/5 shadow-md scale-[1.02]"
                    )}
                >
                  <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider line-clamp-1">
                  {label}
                </span>
                    <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                  {percentage}%
                </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                  {stageCount}
                </span>
                    <span className="text-xs text-muted-foreground font-medium">
                  {stageCount === 1 ? "lead" : "leads"}
                </span>
                  </div>
                </div>
            );
          })}
        </div>

        {/* Leads Container */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              All Leads
            </h2>
            <span className="text-xs text-muted-foreground font-mono bg-background border border-border px-2.5 py-1 rounded-md">
            Showing {leads.length} of {totalItems}
          </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[48px] px-4 py-3.5"></TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Client</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Contact</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Property</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Timeline</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Stage</TableHead>
                  <TableHead className="text-right font-semibold text-foreground px-6 py-3.5 text-xs uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead: any) => {
                  const leadId = lead.id || lead._id;
                  const hasInspection = isInspectionScheduled(lead);
                  const createdDateFormatted = formatDate(lead.createdAt);
                  const inspectionDateFormatted = formatDate(lead.inspection?.scheduledAt);

                  const availableStages = STAGES.filter((s) => {
                    if (hasInspection && RESTRICTED_PAST_INSPECTION.includes(s.key)) {
                      return false;
                    }
                    return true;
                  });

                  return (
                      <TableRow
                          key={leadId}
                          draggable={canChangeStage}
                          onDragStart={(e) =>
                              e.dataTransfer.setData("text/lead-id", leadId)
                          }
                          className="group border-border hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing"
                      >
                        <TableCell className="px-4 py-5 text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-colors">
                          <GripVertical className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col">
                            <Link
                                href={`/account/leads/${leadId}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors capitalize text-sm"
                            >
                              {lead.clientName || "Unnamed Lead"}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            <span>{lead.clientPhone || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs text-foreground font-medium capitalize">
                            <Home className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="line-clamp-1 max-w-[200px]">{lead.property || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="font-medium text-foreground/80">Created:</span>
                              <span>{createdDateFormatted || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-foreground/80">Inspection:</span>
                              {inspectionDateFormatted ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{inspectionDateFormatted}</span>
                              ) : (
                                  <span className="italic text-muted-foreground/70">Not scheduled</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Select
                              value={lead.stage}
                              disabled={!canChangeStage}
                              onValueChange={(value) => handleStageChange(leadId, value)}
                          >
                            <SelectTrigger className={cn("h-8 w-[160px] text-xs font-semibold rounded-lg border shadow-2xs transition-all", getStageColor(lead.stage))}>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStages.map((s) => (
                                  <SelectItem key={s.key} value={s.key} className="text-xs font-medium">
                                    {s.label}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs hover:bg-muted font-medium">
                            <Link href={`/account/leads/${leadId}`} className="flex items-center gap-1.5">
                              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Data Cards View */}
          <div className="divide-y divide-border md:hidden">
            {leads.map((lead: any) => {
              const leadId = lead.id || lead._id;
              const hasInspection = isInspectionScheduled(lead);
              const createdDateFormatted = formatDate(lead.createdAt);
              const inspectionDateFormatted = formatDate(lead.inspection?.scheduledAt);

              const availableStages = STAGES.filter((s) => {
                if (hasInspection && RESTRICTED_PAST_INSPECTION.includes(s.key)) {
                  return false;
                }
                return true;
              });

              return (
                  <div key={leadId} className="p-5 space-y-4 bg-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                            href={`/account/leads/${leadId}`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors capitalize"
                        >
                          {lead.clientName || "Unnamed Lead"}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>{lead.clientPhone || "—"}</span>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs font-medium">
                        <Link href={`/account/leads/${leadId}`}>
                          <Edit className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          Edit
                        </Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Property</span>
                        <span className="font-semibold text-foreground capitalize line-clamp-1">{lead.property || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Inspection</span>
                        <span className={cn("font-medium", inspectionDateFormatted ? "text-emerald-600 dark:text-emerald-400" : "italic text-muted-foreground/70")}>
                      {inspectionDateFormatted || "Not scheduled"}
                    </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">
                    Created {createdDateFormatted || "—"}
                  </span>
                      <Select
                          value={lead.stage}
                          disabled={!canChangeStage}
                          onValueChange={(value) => handleStageChange(leadId, value)}
                      >
                        <SelectTrigger className={cn("h-8 w-[140px] text-xs font-semibold rounded-lg border", getStageColor(lead.stage))}>
                          <SelectValue placeholder="Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStages.map((s) => (
                              <SelectItem key={s.key} value={s.key} className="text-xs font-medium">
                                {s.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/10">
            <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
            />
          </div>
        </div>
      </div>
  );
}
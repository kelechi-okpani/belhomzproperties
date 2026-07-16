"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Edit } from "lucide-react";
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
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "INSPECTION_BOOKED", label: "Inspection Booked" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "CLOSED_WON", label: "Closed Won" },
  { key: "CLOSED_LOST", label: "Closed Lost" },
] as const;

// Stages restricted once an inspection is scheduled/booked
const RESTRICTED_PAST_INSPECTION = ["NEW", "CONTACTED"];

// Stages considered at or past inspection
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

  // Helper to check if lead has a scheduled inspection or advanced stage
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

    // Prevent drag-dropping back into restricted stages if inspection exists
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

  return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              Leads Management
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
              {loading
                  ? "Loading leads…"
                  : `${leads.length} lead${leads.length === 1 ? "" : "s"} total in pipeline`}
            </p>
          </div>
          <Can do="createLeads">
            <Button
                asChild
                variant="default"
                size="sm"
                className="w-24 sm:w-auto h-9 font-medium"
            >
              <Link href="/account/leads/new">
                <Plus className="h-4 w-4 mr-1.5" />
                New lead
              </Link>
            </Button>
          </Can>
        </div>

        {/* Stage Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
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
                        "flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-4 transition-all duration-150 shadow-sm min-h-[110px]",
                        isDraggingOver &&
                        "ring-2 ring-[var(--color-brass)] bg-[var(--color-paper-raised)] shadow-md"
                    )}
                >
                  <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider line-clamp-1">
                  {label}
                </span>
                    <span className="text-[11px] font-mono text-[var(--color-ink-muted)]">
                  {percentage}%
                </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-ink)]">
                  {stageCount}
                </span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] font-medium">
                  {stageCount === 1 ? "lead" : "leads"}
                </span>
                  </div>
                </div>
            );
          })}
        </div>

        {/* Leads Table */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-paper)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">
              All Leads List
            </h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-[var(--color-border)] hover:bg-transparent">
                <TableHead className="font-bold">Client</TableHead>
                <TableHead className="font-bold">Contact Info</TableHead>
                <TableHead className="font-bold">Property</TableHead>
                <TableHead className="font-bold">Created / Inspection</TableHead>
                <TableHead className="font-bold">Stage</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-4">
              {leads.map((lead: any) => {
                const hasInspection = isInspectionScheduled(lead);

                // Compute row-level dates
                const createdDateFormatted = formatDate(lead.createdAt);
                const inspectionDateFormatted = formatDate(lead.inspection?.scheduledAt);

                // Filter stages so New / Contacted are hidden if inspection exists
                const availableStages = STAGES.filter((s) => {
                  if (hasInspection && RESTRICTED_PAST_INSPECTION.includes(s.key)) {
                    return false;
                  }
                  return true;
                });

                return (
                    <TableRow
                        key={lead.id || lead._id}
                        draggable={canChangeStage}
                        onDragStart={(e) =>
                            e.dataTransfer.setData("text/lead-id", lead.id || lead._id)
                        }
                        className="cursor-grab active:cursor-grabbing px-6"
                    >
                      <TableCell className="font-medium">
                        <Link
                            href={`/account/leads/${lead.id || lead._id}`}
                            className="capitalize"
                        >
                          {lead.clientName || "Unnamed Lead"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-[var(--color-ink-muted)] capitalize">
                          {lead.clientPhone}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs capitalize">
                        {lead.property || "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-1 text-xs text-[var(--color-ink-muted)]">
                          <div>
                        <span className="font-semibold text-[var(--color-ink)]">
                          Created:
                        </span>{" "}
                            {createdDateFormatted || "—"}
                          </div>
                          <div>
                        <span className="font-semibold text-[var(--color-ink)]">
                          Inspection:
                        </span>{" "}
                            {inspectionDateFormatted ? (
                                <span>{inspectionDateFormatted}</span>
                            ) : (
                                <span className="italic text-amber-600/80">
                            No inspection fixed
                          </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                            value={lead.stage}
                            disabled={!canChangeStage}
                            onValueChange={(value) =>
                                handleStageChange(lead.id || lead._id, value)
                            }
                        >
                          <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStages.map((s) => (
                                <SelectItem key={s.key} value={s.key}>
                                  {s.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right capitalize">
                        <Link
                            href={`/account/leads/${lead.id || lead._id}`}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit Lead
                        </Link>
                      </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="px-8">
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
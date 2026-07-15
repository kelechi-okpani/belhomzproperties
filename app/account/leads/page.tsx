"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { LEADS_QUERY, UPDATE_LEAD_STAGE } from "../../../dashboard/lib/graphql/documents";
import { LeadCard } from "../../../dashboard/components/leads/lead-card";
import { Button } from "@/components/ui/button";
import { Can } from "../../../dashboard/components/auth/can";
import { can } from "../../../dashboard/lib/permissions";
import { useAuthStore } from "../../../dashboard/store/auth-store";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "INSPECTION_BOOKED", label: "Inspection Booked" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "CLOSED_WON", label: "Closed Won" },
  { key: "CLOSED_LOST", label: "Closed Lost" },
] as const;

export default function LeadsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const canChangeStage = can(role, "changeLeadStage");
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(LEADS_QUERY, { variables: {} });
  const [updateStage] = useMutation<any>(UPDATE_LEAD_STAGE);

  const leads = data?.leads ?? [];
  const leadsByStage = (stage: string) => leads.filter((l: any) => l.stage === stage);

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    if (!canChangeStage) return;
    const leadId = e.dataTransfer.getData("text/lead-id");
    if (!leadId) return;
    await updateStage({ variables: { id: leadId, stage } });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-muted)]">
          {loading ? "Loading leads…" : `${leads.length} lead${leads.length === 1 ? "" : "s"}`}
        </p>
        <Can do="createLeads">
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4" />
            New lead
          </Button>
        </Can>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(({ key, label }) => (
          <div
            key={key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStage(key);
            }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={(e) => handleDrop(e, key)}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-paper-raised)]/50 p-3",
              dragOverStage === key && "ring-2 ring-[var(--color-brass)]"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-medium text-[var(--color-ink)]">{label}</h3>
              <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]">
                {leadsByStage(key).length}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {leadsByStage(key).map((lead: any) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  draggable={canChangeStage}
                  onDragStart={(e) => e.dataTransfer.setData("text/lead-id", lead.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

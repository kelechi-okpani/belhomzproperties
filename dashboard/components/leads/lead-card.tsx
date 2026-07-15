import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  inspection?: { scheduledAt: string; location: string } | null;
}

export function LeadCard({
  lead,
  draggable,
  onDragStart,
}: {
  lead: Lead;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}) {
  return (
    <Link href={`/leads/${lead.id}`}>
      <Card
        draggable={draggable}
        onDragStart={(e) => onDragStart?.(e, lead.id)}
        className="cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
      >
        <p className="text-sm font-medium text-[var(--color-ink)]">{lead.clientName}</p>
        <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[var(--color-ink-muted)]">
          <Phone className="h-3 w-3" />
          {lead.clientPhone}
        </p>
        {lead.inspection && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-brass-dark)]">
            <Calendar className="h-3 w-3" />
            {new Date(lead.inspection.scheduledAt).toLocaleDateString()}
          </p>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)]">
          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
        </p>
      </Card>
    </Link>
  );
}

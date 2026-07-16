import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  createdAt: string | number;
  inspection?: { scheduledAt: string; location: string } | null;
}

// Safe helper function to handle null/undefined/invalid dates
function safeFormatDistance(dateStr: string | number | undefined | null): string {
  if (!dateStr) return "recently";

  let parsedDate: Date;

  if (typeof dateStr === "number") {
    parsedDate = new Date(dateStr);
  } else if (!isNaN(Number(dateStr))) {
    // Handles numeric timestamp passed as string (e.g. "1710000000000")
    parsedDate = new Date(Number(dateStr));
  } else {
    // ISO string or standard date string
    parsedDate = parseISO(dateStr);
  }

  return isValid(parsedDate)
      ? formatDistanceToNow(parsedDate, { addSuffix: true })
      : "recently";
}

function safeFormatDate(dateStr: string | undefined | null): string | null {
  if (!dateStr) return null;
  const parsedDate = parseISO(dateStr);
  return isValid(parsedDate) ? parsedDate.toLocaleDateString() : null;
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
  const formattedInspectionDate = safeFormatDate(lead.inspection?.scheduledAt);

  return (
      <Link href={`/account/leads/${lead.id}`}>
        <Card
            draggable={draggable}
            onDragStart={(e) => onDragStart?.(e, lead.id)}
            className="cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
        >
          <p className="text-sm font-medium text-(--color-ink)">{lead.clientName}</p>

          {lead.clientPhone && (
              <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-(--color-ink-muted)">
                <Phone className="h-3 w-3" />
                {lead.clientPhone}
              </p>
          )}

          {lead.inspection && formattedInspectionDate && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-(--color-brass-dark)">
                <Calendar className="h-3 w-3" />
                {formattedInspectionDate}
              </p>
          )}

          <p className="mt-2 text-[10px] uppercase tracking-wide text-(--color-ink-muted)">
            {safeFormatDistance(lead.createdAt)}
          </p>
        </Card>
      </Link>
  );
}
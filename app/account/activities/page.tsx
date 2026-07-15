"use client";

import { useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
// import { ACTIVITIES_HISTORY_QUERY } from "@/lib/graphql/documents";
import { ACTIVITIES_HISTORY_QUERY } from "../../../dashboard/lib/graphql/documents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TYPE_TONE_CLASSES: Record<string, string> = {
  LEAD_CREATED: "bg-amber-100 text-amber-800",
  LEAD_STAGE_CHANGED: "bg-amber-100 text-amber-800",
  LEAD_REASSIGNED: "bg-slate-100 text-slate-700",
  LEAD_NOTE_ADDED: "bg-slate-100 text-slate-700",
  INSPECTION_SCHEDULED: "bg-amber-100 text-amber-800",
  PROPERTY_CREATED: "bg-emerald-100 text-emerald-800",
  PROPERTY_UPDATED: "bg-slate-100 text-slate-700",
  PROPERTY_STATUS_CHANGED: "bg-emerald-100 text-emerald-800",
  PROPERTY_DELETED: "bg-rose-100 text-rose-800",
  PAYMENT_CREATED: "bg-emerald-100 text-emerald-800",
  INSTALLMENT_PAID: "bg-emerald-100 text-emerald-800",
  STAFF_ACCOUNT_CREATED: "bg-amber-100 text-amber-800",
  STAFF_ROLE_CHANGED: "bg-amber-100 text-amber-800",
  STAFF_DEACTIVATED: "bg-rose-100 text-rose-800",
  STAFF_REACTIVATED: "bg-emerald-100 text-emerald-800",
};

export default function ActivitiesPage() {
  const { data, loading } = useQuery<any>(ACTIVITIES_HISTORY_QUERY, { variables: { limit: 100 } });
  const activities = data?.activities ?? [];

  return (
    <Card className="max-w-2xl">
      <ul className="divide-y divide-[var(--color-border)]">
        {loading && <li className="p-5 text-sm text-[var(--color-ink-muted)]">Loading…</li>}
        {!loading && activities.length === 0 && (
          <li className="p-8 text-center text-sm text-[var(--color-ink-muted)]">
            No activity recorded yet.
          </li>
        )}
        {activities.map((item: any) => (
          <li key={item.id} className="flex items-start gap-3 p-4">
            <Badge className={`mt-0.5 shrink-0 ${TYPE_TONE_CLASSES[item.type] ?? "bg-slate-100 text-slate-700"}`}>
              {item.entityType}
            </Badge>
            <div className="min-w-0">
              <p className="text-sm text-[var(--color-ink)]">{item.message}</p>
              <p className="mt-0.5 font-mono text-xs text-[var(--color-ink-muted)]">
                {/*{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}*/}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import { formatDistanceToNow, isValid } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ACTIVITIES_HISTORY_QUERY,
  ACTIVITY_FEED_SUBSCRIPTION,
} from "@/dashboard/lib/graphql/documents";
import { CustomPagination } from "@/dashboard/components/ui/pagination";

// Tone badge colors mapped by activity type
const TYPE_TONE_CLASSES: Record<string, string> = {
  LEAD_CREATED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  LEAD_STAGE_CHANGED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  LEAD_REASSIGNED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  LEAD_NOTE_ADDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  INSPECTION_SCHEDULED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  PROPERTY_CREATED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  PROPERTY_UPDATED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  PROPERTY_STATUS_CHANGED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  PROPERTY_DELETED: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  PAYMENT_CREATED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  INSTALLMENT_PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  STAFF_ACCOUNT_CREATED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  STAFF_ROLE_CHANGED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  STAFF_DEACTIVATED: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  STAFF_REACTIVATED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

/**
 * Safely parses any date value (ISO string, numeric string, Date, or timestamp)
 * and formats it using formatDistanceToNow.
 */
function safeFormatDistanceToNow(dateValue: any): string {
  if (!dateValue) return "Just now";

  const rawDate =
      typeof dateValue === "string" && !isNaN(Number(dateValue))
          ? Number(dateValue)
          : dateValue;

  const dateObj = new Date(rawDate);

  if (!isValid(dateObj)) {
    return "Just now";
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activities, setActivities] = useState<any[]>([]);

  // 1. Initial Data Fetch driven by page and pageSize
  const { data: queryData, loading } = useQuery<any>(ACTIVITIES_HISTORY_QUERY, {
    variables: {
      page,
      limit: pageSize,
    },
    fetchPolicy: "network-only",
  });

  // Extract list and total count dynamically from response shape
  const activitiesResponse = queryData?.activitiesHistory || queryData?.activities;
  const items = Array.isArray(activitiesResponse)
      ? activitiesResponse
      : activitiesResponse?.items ?? [];

  const totalItems =
      activitiesResponse?.meta?.totalCount ??
      activitiesResponse?.totalCount ??
      items.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Sync initial query data to state
  useEffect(() => {
    if (items) {
      setActivities(items);
    }
  }, [queryData]);

  // 2. Real-time Subscription listener for live stream (prepend on page 1)
  const { data: subData } = useSubscription<any>(ACTIVITY_FEED_SUBSCRIPTION);

  useEffect(() => {
    if (subData?.activityFeed && page === 1) {
      const newActivity = subData.activityFeed;
      setActivities((prev) => {
        if (prev.some((item) => item.id === newActivity.id)) return prev;
        return [newActivity, ...prev.slice(0, pageSize - 1)];
      });
    }
  }, [subData, page, pageSize]);

  return (
      <Card className="max-w-2xl border-border bg-card">
        <ul className="divide-y divide-border">
          {loading && (
              <li className="p-5 text-sm text-muted-foreground">
                Loading activity history…
              </li>
          )}

          {!loading && activities.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                No activity recorded yet.
              </li>
          )}

          {!loading &&
              activities.map((item: any) => (
                  <li
                      key={item.id}
                      className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30"
                  >
                    <Badge
                        className={`mt-0.5 shrink-0 font-medium ${
                            TYPE_TONE_CLASSES[item.type] ??
                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                    >
                      {item.entityType}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-normal text-foreground">{item.message}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {safeFormatDistanceToNow(item.createdAt)}
                      </p>
                    </div>
                  </li>
              ))}
        </ul>

        <div className="p-4 border-t border-border">
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
      </Card>
  );
}
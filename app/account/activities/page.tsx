"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import { formatDistanceToNow, isValid } from "date-fns";
import {
  Activity,
  Search,
  Filter,
  Loader2,
  Building2,
  Users,
  CreditCard,
  UserCheck,
  Radio,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ACTIVITIES_HISTORY_QUERY,
  ACTIVITY_FEED_SUBSCRIPTION,
} from "@/dashboard/lib/graphql/documents";
import { CustomPagination } from "@/dashboard/components/ui/pagination";

// Tone badge colors mapped by activity type
const TYPE_TONE_CLASSES: Record<string, string> = {
  LEAD_CREATED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LEAD_STAGE_CHANGED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LEAD_REASSIGNED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  LEAD_NOTE_ADDED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  INSPECTION_SCHEDULED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  PROPERTY_CREATED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  PROPERTY_UPDATED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  PROPERTY_STATUS_CHANGED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  PROPERTY_DELETED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  PAYMENT_CREATED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  INSTALLMENT_PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  STAFF_ACCOUNT_CREATED: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  STAFF_ROLE_CHANGED: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  STAFF_DEACTIVATED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  STAFF_REACTIVATED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

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

// Icon mapper by entity type
function getEntityIcon(entityType: string) {
  const normalized = entityType?.toUpperCase() || "";
  if (normalized.includes("PROPERTY")) return <Building2 className="h-4 w-4 text-emerald-600" />;
  if (normalized.includes("LEAD")) return <Users className="h-4 w-4 text-amber-600" />;
  if (normalized.includes("PAYMENT")) return <CreditCard className="h-4 w-4 text-blue-600" />;
  if (normalized.includes("STAFF") || normalized.includes("USER")) return <UserCheck className="h-4 w-4 text-indigo-600" />;
  return <Activity className="h-4 w-4 text-primary" />;
}

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [activities, setActivities] = useState<any[]>([]);

  // 1. Initial Query Fetch
  const { data: queryData, loading } = useQuery<any>(ACTIVITIES_HISTORY_QUERY, {
    variables: {
      page,
      limit: pageSize,
    },
    fetchPolicy: "network-only",
  });

  const activitiesResponse = queryData?.activitiesHistory || queryData?.activities;
  const rawItems = Array.isArray(activitiesResponse)
      ? activitiesResponse
      : activitiesResponse?.items ?? [];

  const totalItems =
      activitiesResponse?.meta?.totalCount ??
      activitiesResponse?.totalCount ??
      rawItems.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Sync initial query data to local state
  useEffect(() => {
    if (rawItems) {
      setActivities(rawItems);
    }
  }, [queryData]);

  // 2. Real-time Subscription listener
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

  // Client-side Filter
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesSearch = item.message
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesEntity =
          entityFilter === "ALL" ||
          item.entityType?.toUpperCase() === entityFilter;
      return matchesSearch && matchesEntity;
    });
  }, [activities, searchQuery, entityFilter]);

  return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Activity Audit Log
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 border border-emerald-500/20">
              <Radio className="h-3 w-3 animate-pulse" /> Live
            </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time activity trail and system logs across your organization.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                  type="text"
                  placeholder="Filter activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground shadow-sm">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Entities</option>
                <option value="LEAD">Leads</option>
                <option value="PROPERTY">Properties</option>
                <option value="PAYMENT">Payments</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Feed Card */}
        <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading && activities.length === 0 ? (
                <div className="py-16 text-center text-xs text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                  Loading activity history…
                </div>
            ) : filteredActivities.length === 0 ? (
                <div className="py-16 text-center text-xs text-muted-foreground">
                  No activity recorded matching your criteria.
                </div>
            ) : (
                <div className="relative p-6">
                  {/* Vertical Timeline Guide Line */}
                  <div className="absolute left-10 top-8 bottom-8 w-px bg-border/60" />

                  <div className="space-y-6">
                    {filteredActivities.map((item: any) => (
                        <div key={item.id} className="relative flex items-start gap-4 group">
                          {/* Timeline Node Icon */}
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-transform duration-150 group-hover:scale-105">
                            {getEntityIcon(item.entityType)}
                          </div>

                          {/* Content Box */}
                          <div className="flex-1 rounded-lg border border-border/60 bg-muted/20 p-3.5 transition-colors duration-150 hover:bg-muted/40">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge
                                  variant="outline"
                                  className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border ${
                                      TYPE_TONE_CLASSES[item.type] ??
                                      "bg-muted text-muted-foreground border-border"
                                  }`}
                              >
                                {item.entityType || "SYSTEM"}
                              </Badge>
                              <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {safeFormatDistanceToNow(item.createdAt)}
                        </span>
                            </div>

                            <p className="mt-2 text-xs font-medium text-foreground leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Footer Pagination */}
            {totalItems > 0 && (
                <div className="p-4 border-t border-border bg-muted/20">
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
            )}
          </CardContent>
        </Card>
      </div>
  );
}
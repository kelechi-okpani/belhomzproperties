"use client";

import { useEffect, useState } from "react";
import { useSubscription } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import { ACTIVITY_FEED_SUBSCRIPTION } from "../../lib/graphql/documents"; // Keep your exact import path
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export function ActivityTicker({ initial = [] }: { initial?: ActivityItem[] }) {
  const [items, setItems] = useState<ActivityItem[]>(initial);
  const [connected, setConnected] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data } = useSubscription<any>(ACTIVITY_FEED_SUBSCRIPTION);

  // Synchronize internal state if initial props change after mount
  useEffect(() => {
    if (initial && initial.length > 0) {
      setItems(initial);
    }
  }, [initial]);

  useEffect(() => {
    setConnected(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.activityFeed) {
      setItems((prev) => [data.activityFeed, ...prev].slice(0, 30));
    }
  }, [data]);

  // Safe Date parsing helper to block invalid date values from crashing the render
  const formatTimeAgo = (dateString: string | null | undefined) => {
    if (!mounted) return "Loading..."; // Avoid server-client mismatch during hydration
    if (!dateString) return "Recently";

    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return "Recently"; // Safe fallback instead of throwing RangeError
    }

    try {
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
      <Card className="flex h-full flex-col overflow-hidden border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h3 className="font-display text-lg font-medium text-foreground">Live activity</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
              className={cn(
                  "h-2 w-2 rounded-full transition-colors duration-300",
                  connected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
              )}
          />
            {connected ? "Live" : "Connecting…"}
          </div>
        </div>

        <ul className="flex-1 divide-y divide-border/60 overflow-y-auto max-h-[400px]">
          {items.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nothing yet today — activity will appear here the moment it happens.
              </li>
          )}
          {items.map((item, i) => (
              <li
                  key={item.id || i}
                  className={cn(
                      "px-5 py-3 text-sm hover:bg-muted/30 transition-colors",
                      i === 0 && "animate-in fade-in slide-in-from-top-1 duration-300"
                  )}
              >
                <p className="text-foreground font-normal leading-relaxed">{item.message}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {formatTimeAgo(item.createdAt)}
                </p>
              </li>
          ))}
        </ul>
      </Card>
  );
}
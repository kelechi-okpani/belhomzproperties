"use client";
import { Activity as ActivityIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TYPE_LABELS: Record<string, string> = {
    LEAD_NOTE_ADDED: "Notes added",
    LEAD_CREATED: "Leads created",
    LEAD_STAGE_CHANGED: "Stage changes",
    INSPECTION_SCHEDULED: "Inspections booked",
    PROPERTY_CREATED: "Properties added",
    PROPERTY_UPDATED: "Properties updated",
    PROPERTY_STATUS_CHANGED: "Status changes",
    INSTALLMENT_PAID: "Payments recorded",
};

interface ActivityTypeStat {
    type: string;
    count: number;
}

interface MyActivityStatsProps {
    data?: {
        total: number;
        byType: ActivityTypeStat[];
    };
}

export function MyActivityStatsCard({ data: stats }: MyActivityStatsProps) {
    return (
        <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">My Activity (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {stats?.total ?? 0}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            actions logged
          </span>
                </p>

                <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
                    {(stats?.byType ?? []).map((t: any) => (
                        <div key={t.type} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {TYPE_LABELS[t.type] ?? t.type}
              </span>
                            <span className="font-mono font-semibold text-foreground">{t.count}</span>
                        </div>
                    ))}
                    {(!stats?.byType || stats.byType.length === 0) && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground py-2">
                            <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground/60 animate-pulse" />
                            No activity logged yet this month.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
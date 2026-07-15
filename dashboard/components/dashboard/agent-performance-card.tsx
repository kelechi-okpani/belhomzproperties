"use client";

import { Target, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const STAGE_LABELS: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    INSPECTION_BOOKED: "Inspection",
    NEGOTIATION: "Negotiation",
    CLOSED_WON: "Won",
    CLOSED_LOST: "Lost",
};

interface AgentPerformanceCardProps {
    data?: {
        totalLeads: number;
        closedWon: number;
        conversionRate: number;
        byStage: Array<{
            stage: string;
            count: number;
        }>;
    };
}

export function AgentPerformanceCard({ data: perf }: AgentPerformanceCardProps) {
    return (
        <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">My Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Total leads</p>
                        <p className="font-display text-2xl font-bold tracking-tight text-foreground">
                            {perf?.totalLeads ?? 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Closed won</p>
                        <p className="font-display text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
                            {perf?.closedWon ?? 0}
                        </p>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Target className="h-3 w-3 text-primary" /> Conversion
                        </p>
                        <p className="font-display text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
                            {perf?.conversionRate ?? 0}%
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                    {(perf?.byStage ?? []).map((s: any) => (
                        <div key={s.stage} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {STAGE_LABELS[s.stage] ?? s.stage}
              </span>
                            <span className="font-mono font-semibold text-foreground">{s.count}</span>
                        </div>
                    ))}
                    {(!perf?.byStage || perf.byStage.length === 0) && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground py-2">
                            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
                            No leads assigned yet — new leads will show up here.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
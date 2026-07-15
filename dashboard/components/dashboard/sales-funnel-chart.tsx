"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const STAGE_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INSPECTION_BOOKED: "Inspection",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Won",
  CLOSED_LOST: "Lost",
};

const STAGE_COLORS: Record<string, string> = {
  NEW: "#a9812e",
  CONTACTED: "#c98a2c",
  INSPECTION_BOOKED: "#8a9a4e",
  NEGOTIATION: "#4e7a9a",
  CLOSED_WON: "#1f9d63",
  CLOSED_LOST: "#c1443b",
};

interface FunnelStage {
  stage: string;
  count: number;
}

export function SalesFunnelChart({ data }: { data: FunnelStage[] }) {
  const chartData = data.map((d) => ({
    stage: STAGE_LABELS[d.stage] ?? d.stage,
    count: d.count,
    color: STAGE_COLORS[d.stage] ?? "#a9812e",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales funnel</CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-paper-raised)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

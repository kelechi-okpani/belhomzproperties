"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
        notation: "compact",
    }).format(amount);
}

interface RevenueTrendPoint {
    month: string;
    total: number;
}

interface RevenueTrendChartProps {
    data?: RevenueTrendPoint[];
}

export function RevenueTrendChart({ data: trend = [] }: RevenueTrendChartProps) {
    return (
        <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">Revenue Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-2">
                {trend.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No historical trend data found.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trend} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => formatCurrency(v)}
                            />
                            <Tooltip
                                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Revenue"]}
                                contentStyle={{
                                    background: "hsl(var(--popover))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    color: "hsl(var(--popover-foreground))"
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
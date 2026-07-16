"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface LeaderboardAgent {
    agentId: string;
    agentName: string;
    totalLeads: number;
    closedWon: number;
    conversionRate: number;
}

interface AgentLeaderboardProps {
    data?: LeaderboardAgent[];
}

export function AgentLeaderboard({ data = [] }: AgentLeaderboardProps) {
    const agents = [...data];

    return (
        <Card className="border border-border bg-card shadow-sm mt-6 pt-6">
            <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">Agent Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                {agents.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        No leads assigned to any agent yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="pb-3 font-semibold">Agent</th>
                                <th className="pb-3 font-semibold text-right">Total Leads</th>
                                <th className="pb-3 font-semibold text-right">Closed Won</th>
                                <th className="pb-3 font-semibold text-right">Conversion</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                            {agents.map((agent, i) => (
                                <tr key={agent.agentId} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3 font-medium text-foreground flex items-center gap-2">
                                        {i === 0 && agent.closedWon > 0 ? (
                                            <Badge variant="default" className="gap-1 bg-amber-500 hover:bg-amber-600 text-white border-none py-0 px-2">
                                                <Award className="h-3 w-3" /> Top
                                            </Badge>
                                        ) : (
                                            <span className="w-12 text-xs font-semibold text-muted-foreground/60 pl-2">
                          #{i + 1}
                        </span>
                                        )}
                                        <span className="truncate max-w-[120px] sm:max-w-none">
                        {agent.agentName ?? "Unknown agent"}
                      </span>
                                    </td>
                                    <td className="py-3 font-mono text-right text-muted-foreground">{agent.totalLeads}</td>
                                    <td className="py-3 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400">
                                        {agent.closedWon}
                                    </td>
                                    <td className="py-3 font-mono text-right font-semibold text-foreground">{agent.conversionRate}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
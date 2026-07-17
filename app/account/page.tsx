"use client";

import { useQuery } from "@apollo/client/react";
import {
    Building2,
    Users,
    Wallet,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Sparkles,
    RefreshCw,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { ANALYTICS_QUERY } from "@/dashboard/lib/graphql/documents";
import { StatCard } from "@/dashboard/components/dashboard/stat-card";
import { SalesFunnelChart } from "@/dashboard/components/dashboard/sales-funnel-chart";
import { ActivityTicker } from "@/dashboard/components/dashboard/activity-ticker";
import { Can } from "@/dashboard/components/auth/can";
import { useAuthStore } from "@/dashboard/store/auth-store";
import { can } from "@/dashboard/lib/permissions";
import { RevenueTrendChart } from "@/dashboard/components/dashboard/revenue-trend-chart";
import { AgentLeaderboard } from "@/dashboard/components/dashboard/agent-leaderboard";
import { AgentPerformanceCard } from "@/dashboard/components/dashboard/agent-performance-card";
import { MyActivityStatsCard } from "@/dashboard/components/dashboard/my-activity-stats-card";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount ?? 0);
}

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    // Format the current time (e.g., "02:15 PM")
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    let greeting = "Good evening";
    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    }

    // return `${greeting}! The current time is ${timeString}`;
    return `${greeting}! `;
}


export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const { data: rawData, loading, error, refetch } = useQuery<any>(ANALYTICS_QUERY);
    const [greeting, setGreeting] = useState("Welcome");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setGreeting(getGreeting());
        setMounted(true);
    }, []);

    const data = rawData?.analytics;
    const availability = data?.propertyAvailability;
    const pendingCount = data?.pendingPayments?.length ?? 0;
    const overdueCount = data?.overduePayments?.length ?? 0;

    const showMyPerformance = can(user?.role, "viewMyPerformance");
    const showLeaderboard = can(user?.role, "viewAgentLeaderboard");
    const showRevenueTrend = can(user?.role, "viewRevenueTrend");
    const showActivityStats = can(user?.role, "viewMyActivityStats");

    const visiblePerformanceCardsCount = useMemo(() => {
        return [
            showMyPerformance,
            showLeaderboard,
            showRevenueTrend,
            showActivityStats,
        ].filter(Boolean).length;
    }, [showMyPerformance, showLeaderboard, showRevenueTrend, showActivityStats]);

    // Determine grid columns dynamically based on how many cards are visible
    const performanceGridCols = useMemo(() => {
        if (visiblePerformanceCardsCount === 1) return "grid-cols-1";
        if (visiblePerformanceCardsCount === 3) return "grid-cols-1 lg:grid-cols-3";
        return "grid-cols-1 lg:grid-cols-2";
    }, [visiblePerformanceCardsCount]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-1">
                <div className="flex justify-between items-center border-b border-border/40 pb-4">
                    <div className="space-y-2">
                        <div className="h-7 w-56 bg-muted rounded-sm" />
                        <div className="h-4 w-80 bg-muted/60 rounded-sm" />
                    </div>
                    <div className="h-8 w-36 bg-muted/50 rounded-sm" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-card rounded-md border border-border/60" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="h-80 bg-card rounded-md border border-border/60" />
                    <div className="h-80 bg-card rounded-md border border-border/60" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[380px] border border-dashed border-destructive/30 rounded-md p-8 bg-card/50 text-center">
                <div className="p-3 bg-destructive/10 rounded-full mb-3">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-base text-foreground">
                    Unable to synchronize dashboard metrics
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                    We encountered an issue fetching live statistics from the backend service.
                </p>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-sm gap-2 text-xs font-medium"
                >
                    <RefreshCw className="h-3.5 w-3.5" /> Retry Sync
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {greeting}, {user?.name?.split(" ")[0] ?? "there"}
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Real-time portfolio metrics, active leads, and financial breakdown.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 self-start sm:self-center rounded-md border border-border bg-card/60 text-muted-foreground shadow-2xs backdrop-blur-xs">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>
            {mounted
                ? new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
                : "Loading date..."}
          </span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                </div>
            </div>

            {/* Core Operational Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="New Leads Today"
                    value={data?.todaysLeadCount ?? 0}
                    icon={Users}
                />
                <Can do="viewPayments">
                    <StatCard
                        label="Revenue This Month"
                        value={formatCurrency(data?.monthlyRevenue ?? 0)}
                        icon={TrendingUp}
                        tone="success"
                    />
                </Can>
                <Can do="viewProperties">
                    <StatCard
                        label="Available Properties"
                        value={availability?.available ?? 0}
                        icon={Building2}
                    />
                </Can>
                <Can do="viewPayments">
                    <StatCard
                        label="Pending / Overdue"
                        value={pendingCount}
                        suffix={overdueCount > 0 ? `${overdueCount} overdue` : undefined}
                        icon={overdueCount > 0 ? AlertTriangle : Wallet}
                        tone={overdueCount > 0 ? "danger" : "warning"}
                    />
                </Can>
            </div>

            {/* Dynamic Performance Breakdown Grid */}
            {visiblePerformanceCardsCount > 0 && (
                <div className={` gap-5 ${performanceGridCols}`}>
                    <Can do="viewMyPerformance">
                        <AgentPerformanceCard data={data?.myPerformance} />
                    </Can>
                    <Can do="viewAgentLeaderboard">
                        <AgentLeaderboard data={data?.agentLeaderboard} />
                    </Can>
                    <Can do="viewRevenueTrend">
                        <RevenueTrendChart data={data?.revenueTrend} />
                    </Can>
                    <Can do="viewMyActivityStats">
                        <MyActivityStatsCard data={data?.myActivityStats} />
                    </Can>
                </div>
            )}

            {/* Funnel & Property Breakdown Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Can do="viewSalesFunnel">
                        <SalesFunnelChart data={data?.salesFunnel ?? []} />
                    </Can>

                    <Can do="viewProperties">
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Inventory Allocation
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <StatCard
                                    label="Available"
                                    value={availability?.available ?? 0}
                                    icon={Building2}
                                    tone="success"
                                />
                                <StatCard
                                    label="Reserved"
                                    value={availability?.reserved ?? 0}
                                    icon={Building2}
                                    tone="warning"
                                />
                                <StatCard
                                    label="Sold"
                                    value={availability?.sold ?? 0}
                                    icon={Building2}
                                    tone="default"
                                />
                            </div>
                        </div>
                    </Can>
                </div>

                {/* Live Activity Ticker Feed */}
                {/* <div className="lg:col-span-1">
          <ActivityTicker initial={data?.recentActivity ?? []} />
        </div> */}
            </div>
        </div>
    );
}
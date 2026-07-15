"use client";

import { useQuery } from "@apollo/client/react";
import {
    Building2,
    Users,
    Wallet,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
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

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount ?? 0);
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const { data: rawData, loading, error } = useQuery<any>(ANALYTICS_QUERY);
    const [greeting, setGreeting] = useState("Welcome");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setGreeting(getGreeting());
        setMounted(true);
    }, []);

    console.log({ rawData, loading, error }, "Apollo State Check");

    const data = rawData?.analytics;
    const availability = data?.propertyAvailability;
    const pendingCount = data?.pendingPayments?.length ?? 0;
    const overdueCount = data?.overduePayments?.length ?? 0;

    const showMyPerformance = can(user?.role, "viewMyPerformance");
    const showLeaderboard = can(user?.role, "viewAgentLeaderboard");
    const showRevenueTrend = can(user?.role, "viewRevenueTrend");
    const showActivityStats = can(user?.role, "viewMyActivityStats");

    const visiblePerformanceCardsCount = [
        showMyPerformance,
        showLeaderboard,
        showRevenueTrend,
        showActivityStats
    ].filter(Boolean).length;

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-8 w-64 bg-muted rounded" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-card rounded-xl border border-border" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="h-96 bg-card rounded-xl border border-border" />
                    <div className="h-96 bg-card rounded-xl border border-border" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-xl p-8 bg-card text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-semibold text-lg text-foreground">Unable to load dashboard data</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Something went wrong while communicating with the data API. Please try refreshing the page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Welcome Banner */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {greeting}, {user?.name?.split(" ")[0] ?? "there"}
                        <Sparkles className="h-5 w-5 text-primary/80 animate-pulse" />
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Here is a consolidated look at your business vitals and properties portfolio today.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 self-start sm:self-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {/* Guard with mounted state to prevent hydration mismatches */}
                    <span>
                        {mounted
                            ? new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                            : "Loading date..."
                        }
                    </span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
                </div>
            </div>

            {/* Core KPI Stat Cards */}
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

            {/* Role-Specific Dynamic Performance Grid */}
            {visiblePerformanceCardsCount > 0 && (
                <div className={`grid grid-cols-1 gap-6 ${visiblePerformanceCardsCount === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}`}>
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

            {/* Interactive Charts & Live Streams */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Can do="viewSalesFunnel">
                        <SalesFunnelChart data={data?.salesFunnel ?? []} />
                    </Can>

                    <Can do="viewProperties">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Property Inventory Summary
                            </h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <StatCard label="Available" value={availability?.available ?? 0} icon={Building2} tone="success" />
                                <StatCard label="Reserved" value={availability?.reserved ?? 0} icon={Building2} tone="warning" />
                                <StatCard label="Sold" value={availability?.sold ?? 0} icon={Building2} tone="default" />
                            </div>
                        </div>
                    </Can>
                </div>

                {/* Live Stream feed */}
                {/*<div className="lg:col-span-1">*/}
                {/*    <ActivityTicker initial={data?.recentActivity ?? []} />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
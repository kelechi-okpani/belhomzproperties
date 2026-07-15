"use client";

import { useState } from "react";
import { Sidebar } from "@/dashboard/components/layout/sidebar";
import { Topbar } from "@/dashboard/components/layout/topbar";
import { useRequireAuth } from "@/dashboard/hooks/use-require-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { ready } = useRequireAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop mini state

    if (!ready) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75" />
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background font-sans antialiased">
            {/* Mobile Sidebar Overlay Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Navigation Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={sidebarCollapsed}
            />

            {/* Main App Content Stream */}
            <div className="flex flex-1 flex-col overflow-hidden w-full">
                <Topbar
                    onMenuToggle={() => setSidebarOpen(true)}
                    onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    isCollapsed={sidebarCollapsed}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-background to-secondary/20 animate-in fade-in duration-300">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
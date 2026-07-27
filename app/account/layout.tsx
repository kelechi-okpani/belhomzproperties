"use client";
import { useState } from "react";
import { Sidebar } from "@/dashboard/components/layout/sidebar";
import { Topbar } from "@/dashboard/components/layout/topbar";
import {AuthGuard} from "@/dashboard/lib/auth-guard";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AuthGuard>
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
                        <div className="max-w-8xl mx-auto w-full">{children}</div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}


// "use client";
//
// import { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { Sidebar } from "@/dashboard/components/layout/sidebar";
// import { Topbar } from "@/dashboard/components/layout/topbar";
// import { useAuthStore } from "@/dashboard/store/auth-store";
// import {DashboardLoader} from "@/dashboard/components/ui/dashboard-loader";
//
// export default function DashboardLayout({children}: { children: React.ReactNode; }) {
//     const router = useRouter();
//     const pathname = usePathname();
//
//     // Auth state from Zustand
//     const token = useAuthStore((s) => s.accessToken);
//     const [isHydrated, setIsHydrated] = useState(false);
// // Layout UI states
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//
//     // 1. Wait for client-side mounting / Zustand store hydration
//     useEffect(() => {
//         // If using zustand persist, wait for store hydration
//         if (useAuthStore.persist?.hasHydrated) {
//             const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
//             if (useAuthStore.persist.hasHydrated()) setIsHydrated(true);
//             return () => unsub();
//         } else {
//             setIsHydrated(true);
//         }
//     }, []);
//
//     // 2. Only validate auth AFTER state hydration completes
//     useEffect(() => {
//         if (!isHydrated) return;
//
//         if (!token) {
//             sessionStorage.setItem("session_expired_notice", "true");
//             router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
//         }
//     }, [token, isHydrated, router, pathname]);
//
//     // 3. Single unified loader while hydrating or redirecting missing token
//     if (!isHydrated || !token) {
//         return <DashboardLoader message="Preparing your workspace..." />;
//     }
//
//
//     return (
//         <div className="flex h-screen overflow-hidden bg-background font-sans antialiased">
//             {/* Mobile Sidebar Overlay Backdrop */}
//             {sidebarOpen && (
//                 <div
//                     className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden"
//                     onClick={() => setSidebarOpen(false)}
//                 />
//             )}
//
//             {/* Navigation Sidebar */}
//             <Sidebar
//                 isOpen={sidebarOpen}
//                 onClose={() => setSidebarOpen(false)}
//                 isCollapsed={sidebarCollapsed}
//             />
//
//             {/* Main App Content Stream */}
//             <div className="flex flex-1 flex-col overflow-hidden w-full">
//                 <Topbar
//                     onMenuToggle={() => setSidebarOpen(true)}
//                     onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//                     isCollapsed={sidebarCollapsed}
//                 />
//
//                 <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-background to-secondary/20 animate-in fade-in duration-300">
//                     <div className="max-w-7xl mx-auto w-full">{children}</div>
//                 </main>
//             </div>
//         </div>
//     );
// }
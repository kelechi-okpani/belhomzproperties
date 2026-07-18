"use client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/dashboard/store/auth-store";
import { isTokenExpired } from "@/dashboard/lib/auth-utils";
import { DashboardLoader } from "@/dashboard/components/ui/dashboard-loader";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const token = useAuthStore((state) => state.accessToken);
    const logout = useAuthStore((state) => state.logout);

    const [isHydrated, setIsHydrated] = useState(false);

    // Prevent multiple logout/redirect executions
    const hasHandledExpiry = useRef(false);

    /**
     * Wait for Zustand Persist to hydrate.
     */
    useEffect(() => {
        const persist = useAuthStore.persist;

        if (!persist) {
            setIsHydrated(true);
            return;
        }

        if (persist.hasHydrated()) {
            setIsHydrated(true);
            return;
        }

        const unsubscribe = persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        return unsubscribe;
    }, []);

    /**
     * Decode the token only once per render.
     */
    const tokenExpired = useMemo(() => {
        return !token || isTokenExpired(token);
    }, [token]);

    /**
     * Redirect unauthenticated users.
     */
    useEffect(() => {
        if (!isHydrated) return;

        if (!tokenExpired) {
            hasHandledExpiry.current = false;
            return;
        }

        if (hasHandledExpiry.current) return;

        hasHandledExpiry.current = true;

        logout?.();

        sessionStorage.setItem("session_expired_notice", "true");

        // Prevent redirect loops
        if (pathname !== "/login") {
            router.replace(
                `/login?redirect=${encodeURIComponent(pathname)}`
            );
        }
    }, [
        isHydrated,
        tokenExpired,
        pathname,
        router,
        logout,
    ]);

    /**
     * Block rendering until authentication is verified.
     */
    if (!isHydrated || tokenExpired) {
        return (
            <DashboardLoader message="Verifying session authorization..." />
        );
    }

    return <>{children}</>;
}

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuthStore } from "@/dashboard/store/auth-store";
// import { isTokenExpired } from "@/dashboard/lib/auth-utils";
// import { DashboardLoader } from "@/dashboard/components/ui/dashboard-loader";
//
// export function AuthGuard({ children }: { children: React.ReactNode }) {
//     const router = useRouter();
//     const pathname = usePathname();
//
//     const token = useAuthStore((s) => s.accessToken);
//     const logout = useAuthStore((s) => s.logout);
//     const [isHydrated, setIsHydrated] = useState(false);
//
//     // 1. Wait for Zustand store to hydrate from localStorage
//     useEffect(() => {
//         if (useAuthStore.persist?.hasHydrated) {
//             const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
//             if (useAuthStore.persist.hasHydrated()) setIsHydrated(true);
//             return () => unsub();
//         } else {
//             setIsHydrated(true);
//         }
//     }, []);
//
//     // 2. Proactively evaluate token state on route load / reload
//     useEffect(() => {
//         if (!isHydrated) return;
//
//         if (!token || isTokenExpired(token)) {
//             if (typeof logout === "function") logout();
//             sessionStorage.setItem("session_expired_notice", "true");
//             router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
//         }
//     }, [token, isHydrated, router, pathname, logout]);
//
//     // Block protected UI while validating token status
//     if (!isHydrated || !token || isTokenExpired(token)) {
//         return <DashboardLoader message="Verifying session authorization..." />;
//     }
//
//     return <>{children}</>;
// }
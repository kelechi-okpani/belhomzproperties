"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth-store";

/**
 * Guards overview routes client-side. Zustand's `persist` middleware
 * hydrates from localStorage asynchronously, so we wait one tick
 * (`hydrated`) before checking — otherwise a logged-in user briefly
 * looks logged-out on refresh and gets bounced to /login.
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && (!user || !accessToken)) {
      router.replace("/login");
    }
  }, [hydrated, user, accessToken, router]);

  return { user, ready: hydrated && !!user && !!accessToken };
}

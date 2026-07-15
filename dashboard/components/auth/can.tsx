"use client";
import { useAuthStore } from "../../store/auth-store";
import { can, type Permission } from "../../lib/permissions";

export function Can({
  do: permission,
  children,
  fallback = null,
}: {
  do: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const role = useAuthStore((s) => s.user?.role);
  return can(role, permission) ? <>{children}</> : <>{fallback}</>;
}

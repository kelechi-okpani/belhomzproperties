"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
  STAFF_QUERY,
  CHANGE_USER_ROLE_MUTATION,
  DEACTIVATE_USER_MUTATION,
  REACTIVATE_USER_MUTATION,
} from "../../../dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../../../dashboard/store/auth-store";
import { AccessDenied } from "../../../dashboard/components/auth/access-denied";
import { can } from "@/dashboard/lib/permissions";

const ROLES = ["OWNER", "AGENT", "STAFF", "FINANCE"] as const;

export default function StaffPage() {
  const role = useAuthStore((s) => s.user?.role);
  const allowed = can(role, "viewStaff");

  const { data, loading, refetch } = useQuery<any>(STAFF_QUERY, { skip: !allowed });
  const [changeRole] = useMutation<any>(CHANGE_USER_ROLE_MUTATION);
  const [deactivate] = useMutation<any>(DEACTIVATE_USER_MUTATION);
  const [reactivate] = useMutation<any>(REACTIVATE_USER_MUTATION);

  if (!allowed) return <AccessDenied />;
  if (loading) return <p className="text-sm text-[var(--color-ink-muted)]">Loading staff…</p>;

  const staff = data?.staff ?? [];

  const handleRoleChange = async (id: string, newRole: string) => {
    await changeRole({ variables: { id, role: newRole } });
    refetch();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await (isActive ? deactivate : reactivate)({ variables: { id } });
    refetch();
  };

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {staff.map((member: any) => (
              <tr key={member.id}>
                <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{member.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--color-ink-muted)]">
                  {member.email}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-2 py-1 text-xs"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <Badge variant={member.isActive ? "secondary" : "outline"}>
                    {member.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(member.id, member.isActive)}
                  >
                    {member.isActive ? (
                      <>
                        <ShieldOff className="h-3.5 w-3.5" /> Deactivate
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" /> Reactivate
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <p className="p-8 text-center text-sm text-[var(--color-ink-muted)]">No staff yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

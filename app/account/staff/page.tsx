"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ShieldCheck, ShieldOff, Loader2, Phone } from "lucide-react";
import {
  STAFF_QUERY,
  CHANGE_USER_ROLE_MUTATION,
  DEACTIVATE_USER_MUTATION,
  REACTIVATE_USER_MUTATION,
} from "@/dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/dashboard/store/auth-store";
import { AccessDenied } from "@/dashboard/components/auth/access-denied";
import { can } from "@/dashboard/lib/permissions";
import {CustomPagination} from "@/dashboard/components/ui/pagination";

const ROLES = ["OWNER", "AGENT", "STAFF"] as const;

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
}

export default function StaffPage() {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { toast } = useToast();
  const role = useAuthStore((s) => s.user?.role);
  const allowed = can(role, "viewStaff");

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<{ staff: StaffMember[] }>(
      STAFF_QUERY,
      { skip: !allowed }
  ) as any;



  const [changeRole] = useMutation(CHANGE_USER_ROLE_MUTATION);
  const [deactivate] = useMutation(DEACTIVATE_USER_MUTATION);
  const [reactivate] = useMutation(REACTIVATE_USER_MUTATION);

  if (!allowed) return <AccessDenied />;

  if (loading) {
    return (
        <div className="flex min-h-[300px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-ink-muted)]" />
            <p className="text-sm font-medium text-[var(--color-ink-muted)]">
              Loading staff details…
            </p>
          </div>
        </div>
    );
  }

  const staff = data?.staff ?? [];
  const totalItems = data?.staff?.totalCount ?? staff.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleRoleChange = async (member: StaffMember, newRole: string) => {
    // Safety guard: Prevent changing an OWNER's role
    if (member.role === "OWNER") {
      toast({
        variant: "destructive",
        title: "Action not permitted",
        description: "The OWNER role cannot be modified.",
      });
      return;
    }

    setActiveActionId(member.id);
    try {
      await changeRole({ variables: { id: member.id, role: newRole } });
      toast({
        title: "Role updated",
        description: `Staff member role updated to ${newRole}.`,
      });
      await refetch();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Role update failed",
        description: err?.message || "Could not update staff role.",
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const handleToggleActive = async (member: StaffMember) => {
    // Optional: Also prevent deactivating/reactivating an OWNER if needed
    if (member.role === "OWNER") {
      toast({
        variant: "destructive",
        title: "Action not permitted",
        description: "The OWNER account status cannot be altered.",
      });
      return;
    }

    setActiveActionId(member.id);
    try {
      await (member.isActive ? deactivate : reactivate)({
        variables: { id: member.id },
      });
      toast({
        title: member.isActive ? "Account deactivated" : "Account reactivated",
        description: `Staff member has been ${
            member.isActive ? "deactivated" : "reactivated"
        }.`,
      });
      await refetch();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: err?.message || "Failed to update staff status.",
      });
    } finally {
      setActiveActionId(null);
    }
  };

  return (
      <Card className="rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-muted)] bg-[var(--color-paper-raised)]/50">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Contact Info</th>
              <th className="px-5 py-3.5 font-semibold">Role</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
            {staff.map((member:any) => {
              const isProcessing = activeActionId === member.id;
              const isOwner = member.role === "OWNER";

              return (
                  <tr
                      key={member.id}
                      className="hover:bg-[var(--color-paper-raised)]/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-[var(--color-ink)]">
                      {member.name}
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      <div className="font-mono text-xs text-[var(--color-ink-muted)]">
                        {member.email}
                      </div>
                      {member.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                          value={member.role}
                          disabled={isProcessing || isOwner}
                          onChange={(e) =>
                              handleRoleChange(member, e.target.value)
                          }
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                          variant={member.isActive ? "secondary" : "outline"}
                          className="text-[10px] tracking-wide uppercase px-2.5 py-0.5"
                      >
                        {member.isActive ? "Active" : "Deactivated"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                          size="sm"
                          variant="ghost"
                          disabled={isProcessing || isOwner}
                          onClick={() => handleToggleActive(member)}
                          className="gap-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : member.isActive ? (
                            <>
                              <ShieldOff className="h-3.5 w-3.5 text-[var(--color-danger)]" />{" "}
                              Deactivate
                            </>
                        ) : (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{" "}
                              Reactivate
                            </>
                        )}
                      </Button>
                    </td>
                  </tr>
              );
            })}
            </tbody>

          </table>
          {staff.length === 0 && (
              <p className="p-8 text-center text-sm text-[var(--color-ink-muted)]">
                No staff members found.
              </p>
          )}

          <div className="px-8">
            <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
            />
          </div>
        </CardContent>
      </Card>
  );
}
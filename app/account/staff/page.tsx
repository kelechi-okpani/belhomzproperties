"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  Phone,
  Mail,
  Search,
  UserCog,
  Filter,
} from "lucide-react";
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
import { CustomPagination } from "@/dashboard/components/ui/pagination";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { toast } = useToast();
  const role = useAuthStore((s) => s.user?.role);
  const allowed = can(role, "viewStaff");

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Query staff with pagination
  const { data, loading, refetch } = useQuery<any>(STAFF_QUERY, {
    variables: {
      page,
      limit: pageSize,
    },
    skip: !allowed,
    fetchPolicy: "cache-and-network",
  });

  const [changeRole] = useMutation(CHANGE_USER_ROLE_MUTATION);
  const [deactivate] = useMutation(DEACTIVATE_USER_MUTATION);
  const [reactivate] = useMutation(REACTIVATE_USER_MUTATION);

  if (!allowed) return <AccessDenied />;

  const rawStaffList: StaffMember[] = data?.staff?.items ?? data?.staff ?? [];
  const totalItems = data?.staff?.totalCount ?? rawStaffList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Client-side quick filter for search/role
  const filteredStaff = rawStaffList.filter((member) => {
    const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (member: StaffMember, newRole: string) => {
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
        description: `Updated ${member.name}'s role to ${newRole}.`,
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
        description: `${member.name} has been ${
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
      <div className="space-y-6">
        {/* Page Title & Search/Filters Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <UserCog className="h-6 w-6 text-primary" />
              Staff Management
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage team members, assign permissions, and control account statuses.
            </p>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground shadow-sm">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-border">
                {loading && rawStaffList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading staff details...
                      </td>
                    </tr>
                ) : filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        No staff members found.
                      </td>
                    </tr>
                ) : (
                    filteredStaff.map((member) => {
                      const isProcessing = activeActionId === member.id;
                      const isOwner = member.role === "OWNER";

                      return (
                          <tr
                              key={member.id}
                              className="hover:bg-muted/40 transition-colors duration-150"
                          >
                            {/* Member Name */}
                            <td className="px-5 py-4 font-semibold text-foreground whitespace-nowrap">
                              {member.name}
                            </td>

                            {/* Contact Info */}
                            <td className="px-5 py-4 space-y-0.5">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Mail className="h-3 w-3 shrink-0 text-primary/70" />
                                <span className="font-mono text-[11px]">{member.email}</span>
                              </div>
                              {member.phone && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Phone className="h-3 w-3 shrink-0 text-primary/70" />
                                    <span className="text-[11px]">{member.phone}</span>
                                  </div>
                              )}
                            </td>

                            {/* Role Dropdown */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <select
                                  value={member.role}
                                  disabled={isProcessing || isOwner}
                                  onChange={(e) =>
                                      handleRoleChange(member, e.target.value)
                                  }
                                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                              >
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                ))}
                              </select>
                            </td>

                            {/* Account Status Badge */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <Badge
                                  variant={member.isActive ? "default" : "secondary"}
                                  className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 ${
                                      member.isActive
                                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                          : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                {member.isActive ? "Active" : "Deactivated"}
                              </Badge>
                            </td>

                            {/* Action Toggle Button */}
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isProcessing || isOwner}
                                  onClick={() => handleToggleActive(member)}
                                  className="h-8 gap-1.5 text-xs font-medium border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : member.isActive ? (
                                    <>
                                      <ShieldOff className="h-3.5 w-3.5 text-destructive" />
                                      Deactivate
                                    </>
                                ) : (
                                    <>
                                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                      Reactivate
                                    </>
                                )}
                              </Button>
                            </td>
                          </tr>
                      );
                    })
                )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination Container */}
            {totalItems > 0 && (
                <div className="p-4 border-t border-border bg-muted/20">
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
            )}
          </CardContent>
        </Card>
      </div>
  );
}
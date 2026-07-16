import { UserRole } from "../store/auth-store";

/**
 * Single source of truth for what each role can do in the UI. Mirrors
 * the backend RBAC matrix exactly — the backend is still the real
 * enforcement point, this just keeps the UI from showing actions a
 * role isn't allowed to take.
 */
export const permissions = {
  viewProperties: ["OWNER", "AGENT", "STAFF",],
  manageProperties: ["OWNER", "STAFF"], // create/edit
  deleteProperties: ["OWNER"],

  viewLeads: ["OWNER", "AGENT", "STAFF"],
  createLeads: ["OWNER", "AGENT", "STAFF"],
  changeLeadStage: ["OWNER", "AGENT", "STAFF"],
  reassignLeads: ["OWNER"],
  addLeadNotes: ["OWNER", "AGENT", "STAFF"],
  scheduleInspections: ["OWNER", "AGENT", "STAFF"],

  viewPayments: ["OWNER",],
  managePayments: ["OWNER"],

  viewStaff: ["OWNER"],
  manageStaff: ["OWNER"],

  viewActivities: ["OWNER", "AGENT", "STAFF",],
  viewSalesFunnel: ["OWNER"],
  viewTopAgents: ["OWNER"],

  viewMyPerformance: ["AGENT"],
  viewAgentLeaderboard: ["OWNER"],
  viewMyActivityStats: ["OWNER", "AGENT", "STAFF"],
  viewRevenueTrend: ["OWNER"],
} as const satisfies Record<string, readonly UserRole[]>;

export type Permission = keyof typeof permissions;

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return (permissions[permission] as readonly UserRole[]).includes(role);
}

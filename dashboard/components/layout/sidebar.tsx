"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  UserCog,
  Radio,
  Settings,
  LogOut,
  X,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../../store/auth-store";
import { can, type Permission } from "../../lib/permissions";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: Permission;
}[] = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/property", label: "Properties", icon: Building2, permission: "viewProperties" },
  { href: "/account/leads", label: "Leads", icon: Users, permission: "viewLeads" },
  // { href: "/account/payments", label: "Payments", icon: Wallet, permission: "viewPayments" },
  { href: "/account/enquiries", label: "Enquiries", icon: MessageSquare, permission: "viewLeads" },
  { href: "/account/staff", label: "Staff", icon: UserCog, permission: "viewStaff" },

  { href: "/account/activities", label: "Activity", icon: Radio, permission: "viewActivities" },

];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

export function Sidebar({ isOpen, onClose, isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter(
      (item) => !item.permission || can(user?.role, item.permission)
  );

  const userInitials = user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "??";

  return (
      <aside className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-border bg-card shadow-xl transition-all duration-300 ease-in-out md:sticky md:translate-x-0 md:shadow-sm",
          // Mobile state logic
          isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          // Desktop collapsed width logic
          isCollapsed ? "md:w-20" : "md:w-64"
      )}>
        {/* Platform Header */}
        <div className={cn(
            "flex h-16 items-center justify-between px-6",
            isCollapsed && "md:justify-center md:px-2"
        )}>
          <div className="flex items-center overflow-hidden">
            <span className="font-display text-3xl font-bold tracking-tight text-primary">
              Bel
            </span>
            <span className={cn(
                "font-display text-3xl font-bold tracking-tight text-foreground transition-all duration-300",
                isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
            )}>
              homz
            </span>
          </div>

          {/* Mobile Flyout Close Controller */}
          <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden transition-colors"
              aria-label="Close layout panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Structural Navigation Link List */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
          <p className={cn(
              "px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-3 transition-opacity duration-300",
              isCollapsed ? "md:opacity-0 md:h-0 md:mb-0" : "opacity-100"
          )}>
            Workspace
          </p>
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(`/${href}`);

            return (
                <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    title={isCollapsed ? label : undefined} // Tooltip when collapsed
                    className={cn(
                        "group relative flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                            ? "bg-primary/70 text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        isCollapsed && "md:justify-center md:px-0"
                    )}
                >
                  <Icon className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className={cn(
                      "transition-all duration-300 whitespace-nowrap  font-bold",
                      isCollapsed ? "md:w-0 md:opacity-0 md:pointer-events-none" : "w-auto opacity-100 pl-2"
                  )}>
                    {label}
                  </span>
                </Link>
            );
          })}
        </nav>

        {/* User Dashboard Profile Tray */}
        <div className="border-t border-border p-4 space-y-3 bg-[var(--sidebar,var(--card))]">
          {/*<Link*/}
          {/*    href="/account/settings"*/}
          {/*    onClick={onClose}*/}
          {/*    title={isCollapsed ? "Settings" : undefined}*/}
          {/*    className={cn(*/}
          {/*        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",*/}
          {/*        pathname?.startsWith("/account/settings")*/}
          {/*            ? "bg-primary text-primary-foreground shadow-sm"*/}
          {/*            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",*/}
          {/*        isCollapsed && "md:justify-center md:px-0"*/}
          {/*    )}*/}
          {/*>*/}
          {/*  <Settings className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />*/}
          {/*  <span className={cn(*/}
          {/*      "transition-all duration-300 whitespace-nowrap",*/}
          {/*      isCollapsed ? "md:w-0 md:opacity-0 md:pointer-events-none" : "w-auto opacity-100"*/}
          {/*  )}>*/}
          {/*    Settings*/}
          {/*  </span>*/}
          {/*</Link>*/}

          <div className={cn(
              "flex items-center justify-between rounded-lg border border-border bg-background p-3 shadow-sm transition-all duration-300",
              isCollapsed && "md:justify-center md:p-1.5"
          )}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground border border-border/40">
                {userInitials}
              </div>
              <div className={cn(
                  "min-w-0 transition-all duration-300",
                  isCollapsed ? "md:w-0 md:opacity-0 md:hidden" : "w-auto opacity-100"
              )}>
                <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                  {user?.name ?? "—"}
                </p>
                <p className="truncate text-xs font-medium text-muted-foreground capitalize">
                  {user?.role?.toLowerCase() ?? ""}
                </p>
              </div>
            </div>
            <button
                onClick={logout}
                aria-label="Log out of application"
                className={cn(
                    "group rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95",
                    isCollapsed && "md:hidden" // Hide logout button in mini view to avoid UI crowding
                )}
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </aside>
  );
}
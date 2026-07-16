"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {NotificationDropdown} from "@/dashboard/components/ui/NotificationDropdown";


const TITLES: Record<string, string> = {
  "/account/": "Overview Analytics",
  "/account/property": "Properties Portfolio",
  "/account/leads": "Leads Pipeline",
  "/account/payments": "Payments & Financials",
    "/account/enquiries": "Enquiry Management",
  "/account/staff": "Staff Management",
  "/account/activities": "Activity Audit Feed",
  // "/account/settings": "Account Settings",
};

function titleFor(pathname: string): string {
  const match = Object.keys(TITLES).find((key) => pathname.startsWith(key));
  return match ? TITLES[match] : "Belhomz Portal";
}

interface TopbarProps {
  onMenuToggle: () => void;
  onCollapseToggle: () => void;
  isCollapsed: boolean;
}

export function Topbar({
                         onMenuToggle,
                         onCollapseToggle,
                         isCollapsed,
                       }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-4 lg:px-4 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Toggle */}
          <button
              onClick={onMenuToggle}
              className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-foreground md:hidden transition-colors shadow-sm"
              aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Mini/Full Toggle */}
          <button
              onClick={onCollapseToggle}
              className="hidden md:flex rounded-md border border-border bg-background p-2 text-muted-foreground hover:text-foreground transition-colors shadow-sm"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
            ) : (
                <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground truncate max-w-[160px] sm:max-w-none animate-in slide-in-from-left-4 duration-300">
            {titleFor(pathname ?? "")}
          </h1>
        </div>

        {/* Global Interface Controls Layout Row */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Isolated Real-time Notifications Bell Dropdown */}
          <NotificationDropdown />

          {/* System Color Theme Toggler */}
          {mounted && (
              <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle system appearance theme state"
                  className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 shadow-sm transition-all duration-200 active:rotate-45 active:scale-95"
              >
                {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-primary animate-in fade-in zoom-in duration-200" />
                ) : (
                    <Moon className="h-4 w-4 text-foreground animate-in fade-in zoom-in duration-200" />
                )}
              </button>
          )}
        </div>
      </header>
  );
}
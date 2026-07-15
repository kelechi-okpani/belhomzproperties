import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  suffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
  suffix?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">{label}</span>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            tone === "success" && "bg-[var(--color-success-soft)] text-[var(--color-success)]",
            tone === "warning" && "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
            tone === "danger" && "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
            tone === "default" && "bg-[var(--color-brass-soft)] text-[var(--color-brass-dark)]"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-[var(--color-ink)]">
        {value}
        {suffix && (
          <span className="ml-1 text-base font-normal text-[var(--color-ink-muted)]">
            {suffix}
          </span>
        )}
      </p>
    </Card>
  );
}

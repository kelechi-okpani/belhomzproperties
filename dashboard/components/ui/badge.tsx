import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-[var(--color-border)] text-[var(--color-ink-muted)]",
        success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
        warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        brass: "bg-[var(--color-brass-soft)] text-[var(--color-brass-dark)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-[var(--color-success)]",
            tone === "warning" && "bg-[var(--color-warning)]",
            tone === "danger" && "bg-[var(--color-danger)]",
            tone === "brass" && "bg-[var(--color-brass)]",
            (!tone || tone === "neutral") && "bg-[var(--color-ink-muted)]"
          )}
        />
      )}
      {children}
    </span>
  );
}

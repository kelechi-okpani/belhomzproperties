import { ShieldAlert } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] p-12 text-center">
      <ShieldAlert className="h-8 w-8 text-[var(--color-ink-muted)]" />
      <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
        You don&apos;t have access to this page
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        If you think this is a mistake, ask your account Owner for access.
      </p>
    </div>
  );
}

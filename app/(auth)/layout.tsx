import '../globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--foreground)] px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-6">
          {/*<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brass)] font-display text-base font-semibold text-white">*/}
          {/*  Belhomz*/}
          {/*</div>*/}
          {/*<span className="font-display text-xl font-medium tracking-tight">properties</span>*/}
        </div>
        {children}
      </div>
    </div>
  );
}

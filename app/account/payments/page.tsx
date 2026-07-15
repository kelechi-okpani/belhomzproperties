"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { CheckCircle2 } from "lucide-react";
import { PAYMENTS_QUERY, RECORD_INSTALLMENT_PAYMENT_MUTATION } from "../../../dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { can } from "../../../dashboard/lib/permissions";
import { useAuthStore } from "../../../dashboard/store/auth-store";
import { AccessDenied } from "../../../dashboard/components/auth/access-denied";

// Map payment statuses to Badge variant options accepted by our UI Badge
const STATUS_TONE = {
  PENDING: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
} as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const allowed = can(role, "viewPayments");

  // Hooks must always run in the same order every render, so the
  // permission check happens via `skip`, not an early return before
  // these are called.
  const { data, loading, refetch } = useQuery<any>(PAYMENTS_QUERY, { skip: !allowed });
  const [recordPayment, { loading: recording }] = useMutation<any>(
    RECORD_INSTALLMENT_PAYMENT_MUTATION
  );
  const [payingId, setPayingId] = useState<string | null>(null);

  if (!allowed) return <AccessDenied />;

  const payments = data?.payments ?? [];

  const handleMarkPaid = async (paymentId: string, installmentId: string, amount: number) => {
    setPayingId(installmentId);
    await recordPayment({ variables: { paymentId, installmentId, amount } });
    await refetch();
    setPayingId(null);
  };

  if (loading) return <p className="text-sm text-[var(--color-ink-muted)]">Loading payments…</p>;

  return (
    <div className="space-y-4">
      {payments.length === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-muted)]">
          No payment plans recorded yet.
        </p>
      )}

      {payments.map((payment: any) => (
        <Card key={payment.id}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-medium">{payment.clientName}</h3>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  {formatCurrency(payment.amountPaid)} of {formatCurrency(payment.totalAmount)} paid
                </p>
              </div>
              <div className="w-32">
                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-success)]"
                    style={{
                      width: `${Math.min(
                        100,
                        (payment.amountPaid / payment.totalAmount) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
              {payment.installments.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_TONE[inst.status as keyof typeof STATUS_TONE]}>
                      {inst.status}
                    </Badge>
                    <span className="font-mono text-sm text-[var(--color-ink)]">
                      {formatCurrency(inst.amount)}
                    </span>
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      due {new Date(inst.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {inst.status !== "PAID" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={recording && payingId === inst.id}
                      onClick={() => handleMarkPaid(payment.id, inst.id, inst.amount)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark paid
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

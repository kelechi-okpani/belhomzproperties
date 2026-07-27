"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState, Suspense } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "../../../dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordFormSchema, type ResetPasswordFormValues } from "../../../dashboard/lib/schemas";

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setServerError("This reset link is missing its token. Please request a new link.");
      return;
    }

    setServerError(null);

    try {
      const { data }:any = await resetPassword({
        variables: {
          token,
          newPassword: values.newPassword,
        },
      });

      if (data?.resetPassword) {
        // If API returns string, use it. If API returns boolean true, use the default string message.
        const message =
            typeof data.resetPassword === "string"
                ? data.resetPassword
                : "Password updated successfully. Redirecting you to sign in…";

        setSuccessMessage(message);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      const errorMessage =
          err?.graphQLErrors?.[0]?.message ||
          err?.networkError?.message ||
          err?.message ||
          "This reset link is invalid or has expired.";

      setServerError(errorMessage);
    }
  };

  return (
      <Card className="border border-border shadow-xl bg-card text-card-foreground max-w-md w-full mx-auto rounded-lg">
        <CardContent className="p-6 sm:p-8">
          <Link
              href="/login"
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to login
          </Link>

          <div className="space-y-2 text-center mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Set a new password
            </h1>
          </div>

          {successMessage ? (
              <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="rounded-lg bg-secondary/50 border border-border px-4 py-3.5 text-sm font-medium text-foreground leading-relaxed shadow-inner">
                  {successMessage}
                </p>
              </div>
          ) : (
              <>
                <p className="text-center text-sm text-muted-foreground mb-6">
                  Choose a strong, unique password for your workspace account.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {serverError && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs sm:text-sm font-medium text-destructive leading-relaxed animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{serverError}</span>
                      </div>
                  )}

                  <div className="space-y-2">
                    <Label
                        htmlFor="newPassword"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      New password
                    </Label>
                    <div className="relative">
                      <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="h-11 pr-10 rounded-md border-border bg-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                          {...register("newPassword")}
                      />
                      <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                          {errors.newPassword.message}
                        </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                        htmlFor="confirmPassword"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="h-11 pr-10 rounded-md border-border bg-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                          {...register("confirmPassword")}
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                          {errors.confirmPassword.message}
                        </p>
                    )}
                  </div>

                  <Button
                      type="submit"
                      variant="default"
                      className="w-full h-11 font-medium text-sm sm:text-base rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform active:scale-[0.99] cursor-pointer"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating keys…
                  </span>
                    ) : (
                        "Update password"
                    )}
                  </Button>
                </form>
              </>
          )}
        </CardContent>
      </Card>
  );
}

export default function ResetPasswordPage() {
  return (
      <Suspense
          fallback={
            <Card className="border border-border shadow-xl bg-card text-card-foreground max-w-md w-full mx-auto rounded-lg p-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </Card>
          }
      >
        <ResetPasswordForm />
      </Suspense>
  );
}
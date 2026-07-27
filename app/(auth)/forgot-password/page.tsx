"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordFormSchema, type ForgotPasswordFormValues } from "@/dashboard/lib/schemas";

// Clean, explicitly-typed GraphQL mutation document matching your backend schema
const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema)
  });

  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      // The backend yields an identical response fingerprint regardless of email presence
      // to completely mitigate enumeration vectors; we maintain this security posture here.
      await forgotPassword({ variables: { email: values.email } });
    } catch (err) {
      // Swallowing the error silently to preserve user privacy and prevent side-channel leaks
      console.debug("Password recovery transaction caught:", err);
    } finally {
      setSubmitted(true);
    }
  };

  return (
      <Card className="border-0 shadow-xl bg-white/15 backdrop-blur-md max-w-md w-full mx-auto">
        <CardContent className="p-6 sm:p-8">
          {/* Back navigation element aligned with secondary/muted typographic color maps */}
          <Link
              href="/login"
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to login
          </Link>

          <div className="space-y-2 text-center mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Reset your password
            </h1>
          </div>

          {submitted ? (
              <div className="text-center space-y-4 py-2 animate-in fade-in duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MailCheck className="h-6 w-6" />
                </div>
                <p className="rounded-lg bg-secondary/50 border border-border px-4 py-3.5 text-sm font-medium text-white leading-relaxed shadow-inner">
                  If an account exists for that email, a reset link is on its way. Check your inbox.
                </p>
              </div>
          ) : (
              <>
                <p className="text-center text-sm text-white mb-6">
                  Enter your email and we&apos;ll send you a link to securely recover your account.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-xs font-bold uppercase tracking-widest text-white"
                    >
                      Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        className="h-11 rounded-md border-border bg-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                          {errors.email.message}
                        </p>
                    )}
                  </div>

                  <Button
                      type="submit"
                      variant="default"
                      className="w-full h-11 font-medium text-sm sm:text-base rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform active:scale-[0.99] cursor-pointer"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending link…" : "Send reset link"}
                  </Button>
                </form>
              </>
          )}
        </CardContent>
      </Card>
  );
}
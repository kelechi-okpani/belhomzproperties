"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { gql, CombinedGraphQLErrors } from "@apollo/client";
import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginFormSchema, type LoginFormValues } from "@/dashboard/lib/schemas";
import { useAuthStore } from "@/dashboard/store/auth-store";

// INLINE GRAPHQL MUTATION DEFINITION
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        role
        phone
        isActive
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.accessToken);

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Session expiry check & auto-redirect if already logged in
  useEffect(() => {
    if (token) {
      const redirectUrl = searchParams.get("redirect") || "/account";
      router.replace(redirectUrl);
      return;
    }

    const hasExpiredNotice = sessionStorage.getItem("session_expired_notice");
    if (hasExpiredNotice) {
      toast.error("Your session has expired. Please log in again to continue.", {
        id: "session-expired-notice",
      });
      sessionStorage.removeItem("session_expired_notice");
    }
  }, [token, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const [login] = useMutation<any>(LOGIN_MUTATION);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const { data } = await login({ variables: { input: values } });
      const { user, tokens } = data.login;
      setSession(user, tokens.accessToken, tokens.refreshToken);

      const redirectUrl = searchParams.get("redirect") || "/account";
      router.push(redirectUrl);
    } catch (err) {
      if (CombinedGraphQLErrors.is(err)) {
        setServerError(err.errors[0]?.message ?? "Something went wrong");
      } else {
        setServerError("Unable to reach the server. Please try again.");
      }
    }
  };

  return (
      <Card className="border-0 shadow-xl bg-white/15 backdrop-blur-md max-w-md w-full mx-auto">
        <CardContent className="p-8">
          <div className="space-y-2 text-center mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-white">
              Sign in to your Belhomz Account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-white">
                Email
              </Label>
              <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-11 border-white focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                  {...register("email")}
              />
              {errors.email && (
                  <p className="text-xs font-medium text-[var(--color-danger)]">
                    {errors.email.message}
                  </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-white">
                  Password
                </Label>
                <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-white hover:text-[var(--color-brass-hover)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center w-full">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 pr-14 border-white focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                    {...register("password")}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/40 shrink-0"
                >
                  {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                  ) : (
                      <Eye className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
              {errors.password && (
                  <p className="text-xs font-medium text-[var(--color-danger)]">
                    {errors.password.message}
                  </p>
              )}
            </div>

            {serverError && (
                <p className="bg-[var(--color-danger-soft)] p-3 text-sm font-medium text-[var(--color-danger)] rounded-xl border border-[var(--color-danger)]/10 animate-in fade-in-50 duration-200">
                  {serverError}
                </p>
            )}

            <Button
                type="submit"
                variant="default"
                className="w-full h-11 font-medium text-base shadow-sm transition-transform active:scale-[0.99]"
                disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[var(--color-brass)] hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
  );
}

export default function LoginPage() {
  return (
      <Suspense
          fallback={
            <Card className="border-0 shadow-xl bg-white/15 backdrop-blur-md max-w-md w-full mx-auto p-12 text-center text-white">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-white mb-2" />
              <p className="text-xs text-white/80">Loading login form...</p>
            </Card>
          }
      >
        <LoginForm />
      </Suspense>
  );
}
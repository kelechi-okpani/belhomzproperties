"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation} from "@apollo/client/react";
import { gql, CombinedGraphQLErrors } from "@apollo/client";
import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/dashboard/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerFormSchema, type RegisterFormValues } from "@/dashboard/lib/schemas";


// NATIVE GRAPHQL MUTATION DEFINITION
const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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

const ROLES = [
  { value: "AGENT", label: "Staff", desc: "Day-to-day operations" },
  { value: "STAFF", label: "Agent", desc: "Day-to-day operations" },
  // { value: "OWNER", label: "Owner", desc: "Full organization authority" },
  // { value: "FINANCE", label: "Finance", desc: "Accounting & ledgers" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { role: "AGENT" }
  });

  const [registerAccount] = useMutation<any>(REGISTER_MUTATION);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerAccount({ variables: { input: values } });
      router.push("/login?registered=true");
    } catch (err) {
      if (CombinedGraphQLErrors.is(err)) {
        setServerError(err.errors[0]?.message ?? "Registration failed. Please check parameters.");
      } else {
        setServerError("Unable to reach the server. Please try again.");
      }
    }
  };

  return (
      <Card className="border-0 shadow-xl bg-white/15 backdrop-blur-md max-w-xl w-full mx-auto">
        <CardContent className="p-8">
          <div className="space-y-2 text-center mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
              Create account
            </h1>
            <p className="text-sm text-white">
              Get started with your Belhomz workforce profile.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Dropdown Role Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-white">
                Team Role
              </Label>
              <div className="relative">
                <select
                    id="role"
                    className="w-full h-11 pl-4 pr-10 border-white/30 focus:border-white bg-white/5 text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brass)]/20 appearance-none cursor-pointer transition-all duration-200"
                    {...register("role")}
                >
                  {ROLES.map((role) => (
                      // Using a solid background for standard option elements so dropdown options remain readable
                      <option key={role.value} value={role.value} className="bg-slate-900 text-white p-3">
                        {role.label} ({role.desc})
                      </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.role && <p className="text-xs font-medium text-[var(--color-danger)]">{errors.role.message}</p>}
            </div>

            {/* 🚀 Grid structure removed: Every input below is cleanly layered on its own line */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-white">Full Name</Label>
              <Input
                  id="name"
                  placeholder="Jane Doe"
                  className="h-11 border-white/30 focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                  {...register("name")}
              />
              {errors.name && <p className="text-xs font-medium text-[var(--color-danger)]">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-white">Phone Number </Label>
              <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="h-11 border-white/30 focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                  {...register("phone")}
              />
              {errors.phone && <p className="text-xs font-medium text-[var(--color-danger)]">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-white">Work Email</Label>
              <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-11 border-white/30 focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                  {...register("email")}
              />
              {errors.email && <p className="text-xs font-medium text-[var(--color-danger)]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-white">Password</Label>
              <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-11 pr-10 border-white/30 focus:border-white bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-brass)]/20"
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-[var(--color-danger)]">{errors.password.message}</p>}
            </div>

            {serverError && (
                <p className="rounded-xl bg-[var(--color-danger-soft)] p-3 text-sm font-medium text-[var(--color-danger)] border border-[var(--color-danger)]/10 animate-in fade-in-50 duration-200">
                  {serverError}
                </p>
            )}

            <Button type="submit" variant="default" className="w-full h-11 font-medium text-base shadow-sm transition-transform active:scale-[0.99]" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Register profile"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-white">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--color-brass)] hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
  );
}
import { z } from "zod";

// Match the UserRole GraphQL enum values explicitly
export const UserRoleEnum = z.enum(["OWNER", "AGENT", "STAFF", "FINANCE"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

// --- Added Register Form Schema ---
export const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRoleEnum,
  phone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)), // Clean empty strings to undefined to match optional GraphQL params
});
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
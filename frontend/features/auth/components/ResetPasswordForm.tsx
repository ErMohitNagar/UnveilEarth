"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: data.password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Automatically log them out to force a fresh login, or just let them proceed
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-2xl shadow-sm text-center">
        <h2 className="text-2xl font-bold font-outfit text-green-600">Password Updated!</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been successfully reset. Redirecting you to login...
        </p>
        <Link href="/login" className="text-primary hover:underline font-medium text-sm block mt-4">
          Go to log in now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-2xl shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-outfit">Set new password</h2>
        <p className="text-sm text-muted-foreground mt-2">Please enter your new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <Input 
            type="password" 
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <Input 
            type="password" 
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}

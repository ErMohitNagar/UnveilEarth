"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    
    // We assume the reset-password page will be handled by the frontend
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-2xl shadow-sm text-center">
        <h2 className="text-2xl font-bold font-outfit">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We've sent you a password reset link. Please check your inbox.
        </p>
        <Link href="/login" className="text-primary hover:underline font-medium text-sm block mt-4">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-2xl shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-outfit">Reset password</h2>
        <p className="text-sm text-muted-foreground mt-2">Enter your email and we'll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email" 
            placeholder="you@example.com" 
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline font-medium">
          Back to log in
        </Link>
      </div>
    </div>
  );
}

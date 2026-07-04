import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | UnveilEarth",
  description: "Reset your UnveilEarth password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}

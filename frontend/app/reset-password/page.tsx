import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | UnveilEarth",
  description: "Set your new UnveilEarth password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
}

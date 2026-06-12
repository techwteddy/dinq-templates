import { AuthGuard } from "@/components/auth/auth-guard";
import { OnboardingWizard } from "@/components/auth/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
        <OnboardingWizard />
      </main>
    </AuthGuard>
  );
}

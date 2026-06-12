import { AuthForm } from "@/components/auth/auth-form";
import { GuestOnly } from "@/components/auth/guest-only";

export default function LoginPage() {
  return (
    <GuestOnly>
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
        <AuthForm mode="login" />
      </main>
    </GuestOnly>
  );
}

import GradientBackground from "@/components/GradientBackground";
import { AuthProvider } from "@/components/AuthProvider";
import AuthenticatedApp from "@/components/AuthenticatedApp";

export default function Dashboard() {
  return (
    <GradientBackground>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </GradientBackground>
  );
}

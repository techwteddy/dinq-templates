import GradientBackground from "@/components/GradientBackground";
import { AuthProvider } from "@/components/AuthProvider";
import PublicGallery from "@/components/PublicGallery";

export default function Home() {
  return (
    <GradientBackground>
      <AuthProvider>
        <PublicGallery />
      </AuthProvider>
    </GradientBackground>
  );
}

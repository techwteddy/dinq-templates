import { StatusBar } from "@/components/StatusBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <StatusBar />
      {children}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import NavBar from "./NavBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar userEmail={user.email || ""} onSignOut={signOut} />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 print:p-0 print:max-w-none">
        {children}
      </main>
    </div>
  );
}



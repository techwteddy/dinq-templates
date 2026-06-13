import { redirect } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { getUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	// Redirect to onboarding if university not selected
	if (!user.user_metadata?.university) {
		redirect("/onboarding");
	}

	const userName =
		user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			<TopNav userName={userName} userEmail={user?.email} />
			<main className="flex-1 pt-24">{children}</main>
		</div>
	);
}

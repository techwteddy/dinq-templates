import { getCurrentMember } from "@/lib/supabase-server";
import type { SchoolTest } from "@/lib/database.types";
import SchoolTestsView from "@/components/school-tests/SchoolTestsView";

export default async function SchoolTestsPage() {
  const { supabase, member } = await getCurrentMember();
  const [{ data: tests }, { data: kidMembers }] = await Promise.all([
    supabase.from("school_tests").select("id, kid_name, subject, test_date, notes, grade").order("test_date", { ascending: true }),
    supabase.from("family_members").select("name").eq("role", "kid").order("name"),
  ]);

  const kids = kidMembers?.map((m) => m.name) ?? [];

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">School Tests</h1>
      <SchoolTestsView
        tests={(tests as SchoolTest[]) ?? []}
        memberName={member.name}
        memberRole={member.role}
        today={new Date().toISOString().slice(0, 10)}
        kids={kids}
      />
    </>
  );
}

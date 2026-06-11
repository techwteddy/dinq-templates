import { getCurrentMember } from "@/lib/supabase-server";
import type { Project, ProjectTask } from "@/lib/database.types";
import ProjectBoard from "@/components/home-projects/ProjectBoard";

export default async function HomeProjectsPage() {
  const { supabase, member } = await getCurrentMember();
  const isKid = member.role === "kid";

  const [{ data: projects }, { data: tasks }, { data: allMembers }] = await Promise.all([
    supabase.from("projects").select("id, name, status, description, notes, due_date, assignee").order("created_at", { ascending: true }),
    supabase.from("project_tasks").select("id, project_id, name, done, due_date, assignee").order("created_at", { ascending: true }),
    supabase.from("family_members").select("name").order("name"),
  ]);

  const members = allMembers?.map((m) => m.name) ?? [];

  // Kids see only projects assigned to them or unassigned
  const filteredProjects = ((projects as Project[]) ?? []).filter(
    (p) => !isKid || !p.assignee || p.assignee === member.name
  );

  const tasksByProject = new Map<number, ProjectTask[]>();
  for (const task of (tasks as ProjectTask[]) ?? []) {
    const list = tasksByProject.get(task.project_id) ?? [];
    list.push(task);
    tasksByProject.set(task.project_id, list);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Home Projects</h1>
      <ProjectBoard
        projects={filteredProjects}
        tasksByProject={tasksByProject}
        members={members}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import type { Project, ProjectTask } from "@/lib/database.types";
import {
  addProject, updateProject, deleteProject,
  addProjectTask, updateProjectTask, toggleProjectTask, deleteProjectTask,
} from "@/app/actions";
import AssigneeSelect from "@/components/AssigneeSelect";

const STATUSES = ["planned", "in-progress", "done"] as const;
const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  done: "Done",
};
const STATUS_COLORS: Record<string, string> = {
  planned: "bg-honey/10 border-honey/40",
  "in-progress": "bg-lavender/10 border-lavender/40",
  done: "bg-sage/10 border-sage/40",
};
const STATUS_HEADER: Record<string, string> = {
  planned: "text-honey",
  "in-progress": "text-lavender",
  done: "text-sage",
};

export default function ProjectBoard({
  projects,
  tasksByProject,
  members,
}: {
  projects: Project[];
  tasksByProject: Map<number, ProjectTask[]>;
  members: string[];
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const inputClass = "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-honey focus:outline-none transition-colors";

  const byStatus = new Map<string, Project[]>();
  for (const s of STATUSES) byStatus.set(s, []);
  for (const p of projects) {
    const list = byStatus.get(p.status) ?? [];
    list.push(p);
    byStatus.set(p.status, list);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
      >
        + Add Project
      </button>

      {showAdd && (
        <form
          action={async (fd) => { await addProject(fd); setShowAdd(false); }}
          className="p-4 rounded-2xl border-2 border-honey/30 bg-honey/5 space-y-3 shadow-sm"
        >
          <input name="name" placeholder="Project name *" required className={`w-full ${inputClass}`} />
          <input name="description" placeholder="Description" className={`w-full ${inputClass}`} />
          <input name="notes" placeholder="Notes" className={`w-full ${inputClass}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Due date</label>
              <input name="due_date" type="date" className={`w-full ${inputClass}`} />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Status</label>
              <select name="status" defaultValue="planned" className={`w-full ${inputClass}`}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Assignee</label>
              <AssigneeSelect className={`w-full ${inputClass}`} members={members} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-honey/10 transition-all active:scale-95">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <div key={status} className={`rounded-2xl p-4 border-2 ${STATUS_COLORS[status]} shadow-sm`}>
            <h3 className={`font-semibold mb-3 ${STATUS_HEADER[status]}`}>
              {STATUS_LABELS[status]} ({byStatus.get(status)!.length})
            </h3>
            <div className="space-y-3">
              {byStatus.get(status)!.map((project) => {
                const tasks = tasksByProject.get(project.id) ?? [];
                const doneCount = tasks.filter((t) => t.done).length;
                const isExpanded = expandedId === project.id;

                if (editingId === project.id) {
                  return (
                    <form
                      key={project.id}
                      action={async (fd) => { await updateProject(fd); setEditingId(null); }}
                      className="p-3 rounded-xl bg-card border-2 border-card-border space-y-2"
                    >
                      <input type="hidden" name="id" value={project.id} />
                      <input name="name" defaultValue={project.name} required className={`w-full text-sm ${inputClass}`} />
                      <input name="description" defaultValue={project.description ?? ""} placeholder="Description" className={`w-full text-sm ${inputClass}`} />
                      <input name="notes" defaultValue={project.notes ?? ""} placeholder="Notes" className={`w-full text-sm ${inputClass}`} />
                      <div>
                        <label className="text-xs text-muted block mb-1">Due date</label>
                        <input name="due_date" type="date" defaultValue={project.due_date ?? ""} className={`w-full text-sm ${inputClass}`} />
                      </div>
                      <select name="status" defaultValue={project.status} className={`w-full text-sm ${inputClass}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                      <AssigneeSelect defaultValue={project.assignee} className={`w-full text-sm ${inputClass}`} members={members} />
                      <div className="flex gap-2">
                        <button type="submit" className="px-3 py-1 text-xs rounded-xl bg-honey text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 text-xs rounded-xl border-2 border-card-border transition-all active:scale-95">Cancel</button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div key={project.id} className="rounded-xl bg-card border-2 border-card-border shadow-sm">
                    <div className="p-3">
                      <p className="font-medium">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-muted mt-1">{project.description}</p>
                      )}
                      {project.notes && (
                        <p className="text-xs text-muted mt-1 italic">{project.notes}</p>
                      )}
                      {project.due_date && (
                        <p className="text-xs text-honey mt-1 font-medium">Due: {project.due_date}</p>
                      )}

                      {/* Tasks summary + expand toggle */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                        className="text-xs text-muted mt-2 hover:text-foreground transition-colors"
                      >
                        {tasks.length > 0
                          ? `${isExpanded ? "▼" : "▶"} Tasks: ${doneCount}/${tasks.length} done`
                          : `${isExpanded ? "▼" : "▶"} Add tasks`
                        }
                      </button>

                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => setEditingId(project.id)}
                          className="px-3 py-1 text-xs rounded-xl border-2 border-card-border hover:bg-honey/10 transition-all active:scale-95"
                        >
                          Edit
                        </button>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="px-3 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Expanded tasks section */}
                    {isExpanded && (
                      <div className="border-t-2 border-card-border p-3 space-y-2">
                        {tasks.map((task) =>
                          editingTaskId === task.id ? (
                            <form
                              key={task.id}
                              action={async (fd) => { await updateProjectTask(fd); setEditingTaskId(null); }}
                              className="flex gap-2 flex-wrap py-1"
                            >
                              <input type="hidden" name="id" value={task.id} />
                              <input
                                name="name"
                                defaultValue={task.name}
                                required
                                className={`flex-1 min-w-0 text-sm ${inputClass}`}
                                autoFocus
                              />
                              <input
                                name="due_date"
                                type="date"
                                defaultValue={task.due_date ?? ""}
                                className={`w-36 text-sm ${inputClass}`}
                              />
                              <AssigneeSelect defaultValue={task.assignee} className={`text-sm ${inputClass}`} members={members} />
                              <button type="submit" className="px-3 py-1 text-xs rounded-xl bg-honey text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95">Save</button>
                              <button type="button" onClick={() => setEditingTaskId(null)} className="px-3 py-1 text-xs rounded-xl border-2 border-card-border transition-all active:scale-95">Cancel</button>
                            </form>
                          ) : (
                            <div key={task.id} className="flex items-center justify-between gap-2">
                              <form action={toggleProjectTask} className="flex items-center gap-2 flex-1 min-w-0">
                                <input type="hidden" name="id" value={task.id} />
                                <input type="hidden" name="done" value={String(task.done)} />
                                <button
                                  type="submit"
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 text-[10px] transition-colors ${
                                    task.done
                                      ? "bg-sage border-sage text-white"
                                      : "border-card-border hover:border-sage"
                                  }`}
                                >
                                  {task.done && "✓"}
                                </button>
                                <span className={`text-sm ${task.done ? "line-through text-muted" : ""}`}>
                                  {task.name}
                                </span>
                                {task.assignee && (
                                  <span className="text-[10px] text-sage shrink-0">
                                    {task.assignee}
                                  </span>
                                )}
                                {task.due_date && (
                                  <span className="text-[10px] text-muted shrink-0">
                                    {task.due_date}
                                  </span>
                                )}
                              </form>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => setEditingTaskId(task.id)}
                                  className="text-muted hover:text-honey text-xs transition-colors"
                                >
                                  Edit
                                </button>
                                <form action={deleteProjectTask}>
                                  <input type="hidden" name="id" value={task.id} />
                                  <button type="submit" className="text-muted hover:text-rose text-xs transition-colors">
                                    ×
                                  </button>
                                </form>
                              </div>
                            </div>
                          )
                        )}

                        {/* Add task form */}
                        <form action={addProjectTask} className="flex gap-2 mt-2 flex-wrap">
                          <input type="hidden" name="project_id" value={project.id} />
                          <input
                            name="name"
                            placeholder="New task *"
                            required
                            className={`flex-1 min-w-0 text-sm ${inputClass}`}
                          />
                          <input
                            name="due_date"
                            type="date"
                            className={`w-36 text-sm ${inputClass}`}
                          />
                          <AssigneeSelect className={`text-sm ${inputClass}`} members={members} />
                          <button
                            type="submit"
                            className="px-3 py-1 text-xs rounded-xl bg-honey text-white font-medium hover:opacity-90 shadow-sm shrink-0 transition-all active:scale-95"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
              {byStatus.get(status)!.length === 0 && (
                <p className="text-sm text-muted">No projects</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

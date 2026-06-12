import { Bell, Plus, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-700/70 bg-slate-950/65 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex max-w-xl flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            aria-label="Search"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            placeholder="Search habits, friends, or insights"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>
    </header>
  );
}

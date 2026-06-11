"use client";

import { useState } from "react";
import type { SchoolTest } from "@/lib/database.types";
import { addSchoolTest, updateSchoolTest, deleteSchoolTest } from "@/app/actions";

export default function SchoolTestsView({
  tests,
  memberName,
  memberRole,
  today,
  kids,
}: {
  tests: SchoolTest[];
  memberName: string;
  memberRole: "parent" | "kid";
  today: string;
  kids: string[];
}) {
  const isParent = memberRole === "parent";
  const tabs = isParent ? ["All", ...kids] : [memberName];
  const [activeTab, setActiveTab] = useState(isParent ? "All" : memberName);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const inputClass =
    "px-3 py-2 rounded-xl border-2 border-card-border bg-card focus:border-rose focus:outline-none transition-colors";

  const filtered = tests.filter((t) =>
    activeTab === "All" ? true : t.kid_name === activeTab
  );

  const upcoming = filtered.filter((t) => t.test_date >= today);
  const past = filtered.filter((t) => t.test_date < today);

  const [showPast, setShowPast] = useState(false);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${
              activeTab === tab
                ? "bg-rose text-white shadow-sm"
                : "border-2 border-rose/30 text-rose hover:bg-rose/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="px-4 py-2 rounded-xl bg-rose text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
      >
        + Add Test
      </button>

      {/* Add form */}
      {showAdd && (
        <form
          action={async (fd) => {
            await addSchoolTest(fd);
            setShowAdd(false);
          }}
          className="p-4 rounded-2xl border-2 border-rose/30 bg-rose/5 space-y-3 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isParent ? (
              <select name="kid_name" required className={inputClass}>
                <option value="">Select kid *</option>
                {kids.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            ) : (
              <input type="hidden" name="kid_name" value={memberName} />
            )}
            <input
              name="subject"
              placeholder="Subject *"
              required
              className={inputClass}
            />
            <div>
              <label className="text-xs text-muted block mb-1">Test date *</label>
              <input
                name="test_date"
                type="date"
                required
                className={`w-full ${inputClass}`}
              />
            </div>
            <input name="notes" placeholder="Notes" className={inputClass} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-rose/10 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Upcoming tests */}
      {upcoming.length === 0 && !showAdd && (
        <p className="text-muted">No upcoming tests.</p>
      )}

      <div className="space-y-2">
        {upcoming.map((test) =>
          editingId === test.id ? (
            <EditTestForm
              key={test.id}
              test={test}
              inputClass={inputClass}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <TestCard
              key={test.id}
              test={test}
              today={today}
              onEdit={() => setEditingId(test.id)}
            />
          )
        )}
      </div>

      {/* Past tests */}
      {past.length > 0 && (
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {showPast ? "▼" : "▶"} Past tests ({past.length})
          </button>
          {showPast && (
            <div className="space-y-2 mt-2">
              {past.map((test) =>
                editingId === test.id ? (
                  <EditTestForm
                    key={test.id}
                    test={test}
                    inputClass={inputClass}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <TestCard
                    key={test.id}
                    test={test}
                    today={today}
                    onEdit={() => setEditingId(test.id)}
                    isPast
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TestCard({
  test,
  onEdit,
  isPast,
  today,
}: {
  test: SchoolTest;
  onEdit: () => void;
  isPast?: boolean;
  today: string;
}) {
  const daysUntil = Math.ceil(
    (new Date(test.test_date + "T00:00:00").getTime() - new Date(today + "T00:00:00").getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={`flex items-start justify-between gap-3 p-4 rounded-2xl border-2 shadow-sm ${
        isPast
          ? "border-card-border bg-card opacity-70"
          : daysUntil <= 3
            ? "border-rose/40 bg-rose/5"
            : "border-card-border bg-card"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{test.subject}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose/20 text-rose font-medium">
            {test.kid_name}
          </span>
          {test.grade && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage/20 text-sage font-medium">
              Grade: {test.grade}
            </span>
          )}
        </div>
        <div className="text-xs text-muted mt-1">
          {test.test_date}
          {!isPast && daysUntil >= 0 && (
            <span className={daysUntil <= 3 ? " text-rose font-medium" : ""}>
              {" "}
              ({daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`})
            </span>
          )}
        </div>
        {test.notes && <p className="text-sm text-muted mt-1">{test.notes}</p>}
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-xs rounded-xl border-2 border-card-border hover:bg-rose/10 transition-all active:scale-95"
        >
          Edit
        </button>
        <form action={deleteSchoolTest}>
          <input type="hidden" name="id" value={test.id} />
          <button
            type="submit"
            className="px-3 py-1 text-xs rounded-xl border-2 border-rose/40 text-rose hover:bg-rose/10 transition-all active:scale-95"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

function EditTestForm({
  test,
  inputClass,
  onDone,
}: {
  test: SchoolTest;
  inputClass: string;
  onDone: () => void;
}) {
  return (
    <form
      action={async (fd) => {
        await updateSchoolTest(fd);
        onDone();
      }}
      className="p-4 rounded-2xl border-2 border-rose/30 bg-rose/5 space-y-3 shadow-sm"
    >
      <input type="hidden" name="id" value={test.id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="subject"
          defaultValue={test.subject}
          required
          className={inputClass}
        />
        <div>
          <label className="text-xs text-muted block mb-1">Test date *</label>
          <input
            name="test_date"
            type="date"
            defaultValue={test.test_date}
            required
            className={`w-full ${inputClass}`}
          />
        </div>
        <input
          name="notes"
          defaultValue={test.notes ?? ""}
          placeholder="Notes"
          className={inputClass}
        />
        <input
          name="grade"
          defaultValue={test.grade ?? ""}
          placeholder="Grade"
          className={inputClass}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-rose text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 rounded-xl border-2 border-card-border text-sm hover:bg-rose/10 transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

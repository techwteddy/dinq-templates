"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, getCurrentMember } from "@/lib/supabase-server";
import { notifyParents, notifyParents_mealRequest, notifyFamilyExcept, notifyParentsExcept, notifyEventInvite } from "@/lib/notify-parents";
import { sendInviteEmail } from "@/lib/send-invite-email";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function safeId(formData: FormData, field: string): number {
  const raw = formData.get(field);
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`Invalid ${field}: ${raw}`);
  }
  return num;
}

function safeJsonArray<T>(json: string): T[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function requireString(formData: FormData, field: string): string {
  const val = (formData.get(field) as string)?.trim();
  if (!val) throw new Error(`${field} is required`);
  return val;
}

// ── Family Messages ────────────────────────────────

export async function addMessage(formData: FormData) {
  const supabase = await requireAuth();
  const author = requireString(formData, "author");
  const message = requireString(formData, "message");
  const channel = (formData.get("channel") as string) || "family";

  const { error } = await supabase
    .from("family_messages")
    .insert({ author, message, channel });

  if (error) throw new Error(error.message);

  if (channel === "family") {
    await notifyFamilyExcept(
      author,
      `${author} posted on the board`,
      message.length > 100 ? message.slice(0, 100) + "…" : message,
      "/messages"
    );
  } else {
    // Parents channel — only notify the other parent
    await notifyParentsExcept(
      author,
      `${author} (private)`,
      message.length > 100 ? message.slice(0, 100) + "…" : message,
      "/messages"
    );
  }

  revalidatePath("/");
  revalidatePath("/messages");
}

export async function deleteMessage(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");

  const { error } = await supabase.from("family_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/messages");
}

// ── Calendar ────────────────────────────────────────

export async function addEvent(formData: FormData) {
  const { supabase, member } = await getCurrentMember();
  const title = requireString(formData, "title");
  const description = (formData.get("description") as string)?.trim() || null;
  const start_date = requireString(formData, "start_date");
  const start_time = (formData.get("start_time") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const end_time = (formData.get("end_time") as string) || null;
  const repeat = (formData.get("repeat") as string) || "none";
  const repeat_end_date = (formData.get("repeat_end_date") as string) || null;
  const invitees = formData.getAll("invitees").map(String);
  const external_emails: string[] = safeJsonArray<string>((formData.get("external_emails_json") as string) || "[]");

  const { error } = await supabase
    .from("events")
    .insert({ title, description, start_date, start_time, end_date, end_time, repeat, repeat_end_date, invitees, external_emails });

  if (error) throw new Error(error.message);

  if (invitees.length > 0) {
    await notifyEventInvite(invitees, member.name, title, start_date);
  }
  if (external_emails.length > 0) {
    await sendInviteEmail(external_emails, { title, description, start_date, start_time, end_date, end_time }, member.name);
  }

  revalidatePath("/calendar");
}

export async function updateEvent(formData: FormData) {
  const { supabase, member } = await getCurrentMember();
  const id = safeId(formData, "id");
  const title = requireString(formData, "title");
  const description = (formData.get("description") as string)?.trim() || null;
  const start_date = requireString(formData, "start_date");
  const start_time = (formData.get("start_time") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const end_time = (formData.get("end_time") as string) || null;
  const repeat = (formData.get("repeat") as string) || "none";
  const repeat_end_date = (formData.get("repeat_end_date") as string) || null;
  const invitees = formData.getAll("invitees").map(String);
  const external_emails: string[] = safeJsonArray<string>((formData.get("external_emails_json") as string) || "[]");

  const { error } = await supabase
    .from("events")
    .update({ title, description, start_date, start_time, end_date, end_time, repeat, repeat_end_date, invitees, external_emails })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (invitees.length > 0) {
    await notifyEventInvite(invitees, member.name, title, start_date);
  }
  if (external_emails.length > 0) {
    await sendInviteEmail(external_emails, { title, description, start_date, start_time, end_date, end_time }, member.name);
  }

  revalidatePath("/calendar");
}

export async function deleteEvent(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

// ── Google Calendar Links ──────────────────────────

export async function addCalendarLink(formData: FormData) {
  const supabase = await requireAuth();
  const member_name = formData.get("member_name") as string;
  const ical_url = formData.get("ical_url") as string;

  const { error } = await supabase
    .from("google_calendar_links")
    .upsert({ member_name, ical_url }, { onConflict: "member_name" });

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function deleteCalendarLink(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("google_calendar_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

// ── Supermarket ─────────────────────────────────────

export async function addShoppingList(formData: FormData) {
  const supabase = await requireAuth();
  const name = requireString(formData, "name");
  const { error } = await supabase.from("shopping_lists").insert({ name });
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

export async function deleteShoppingList(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("shopping_lists").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

export async function clearShoppingList(formData: FormData) {
  const supabase = await requireAuth();
  const list_id = safeId(formData, "list_id");
  const { error } = await supabase.from("shopping_items").delete().eq("list_id", list_id).eq("checked", true);
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

export async function restoreShoppingItems(items: { list_id: number; name: string; quantity: string | null; category: string | null; notes: string | null }[]) {
  const supabase = await requireAuth();
  const rows = items.map((i) => ({ ...i, checked: false }));
  const { error } = await supabase.from("shopping_items").insert(rows);
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

export async function addShoppingItem(formData: FormData) {
  const supabase = await requireAuth();
  const list_id = safeId(formData, "list_id");
  const name = requireString(formData, "name");
  const quantity = (formData.get("quantity") as string) || null;
  let category = (formData.get("category") as string) || null;

  // Auto-fill category from persistent item_categories table
  if (!category) {
    const { data: prev } = await supabase
      .from("item_categories")
      .select("category")
      .eq("name", name.toLowerCase())
      .single();

    if (prev?.category) {
      category = prev.category;
    }
  }

  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase
    .from("shopping_items")
    .insert({ list_id, name, quantity, category, notes });

  if (error) throw new Error(error.message);

  // Persist item-to-category mapping for future auto-fill
  if (category) {
    await supabase
      .from("item_categories")
      .upsert({ name: name.toLowerCase(), category }, { onConflict: "name" });
  }

  revalidatePath("/supermarket");
}

export async function toggleShoppingItem(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const checked = formData.get("checked") === "true";

  const { error } = await supabase
    .from("shopping_items")
    .update({ checked: !checked })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

export async function updateShoppingItem(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const name = requireString(formData, "name");
  const quantity = (formData.get("quantity") as string) || null;
  const category = (formData.get("category") as string) || null;

  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase
    .from("shopping_items")
    .update({ name, quantity, category, notes })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Persist item-to-category mapping
  if (category) {
    await supabase
      .from("item_categories")
      .upsert({ name: name.toLowerCase(), category }, { onConflict: "name" });
  }

  revalidatePath("/supermarket");
}

export async function reuseShoppingList(formData: FormData) {
  const supabase = await requireAuth();
  const list_id = safeId(formData, "list_id");
  const list_name = formData.get("list_name") as string;

  // Create new list and fetch old items in parallel
  const [{ data: newList, error: listError }, { data: items }] = await Promise.all([
    supabase
      .from("shopping_lists")
      .insert({ name: `${list_name} (copy)` })
      .select("id")
      .single(),
    supabase
      .from("shopping_items")
      .select("name, quantity, category, notes")
      .eq("list_id", list_id),
  ]);

  if (listError || !newList) throw new Error(listError?.message ?? "Failed to create list");

  if (items && items.length > 0) {
    const newItems = items.map((item) => ({
      list_id: newList.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      notes: item.notes,
      checked: false,
    }));
    const { error: itemsError } = await supabase.from("shopping_items").insert(newItems);
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/supermarket");
}

export async function deleteShoppingItem(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("shopping_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

// ── Meal Plan ──────────────────────────────────────

export async function addMealEntry(formData: FormData) {
  const supabase = await requireAuth();
  const member_name = formData.get("member_name") as string;
  const day_of_week = Number(formData.get("day_of_week"));
  const meal = formData.get("meal") as string;

  const { error } = await supabase
    .from("meal_plan")
    .insert({ member_name, day_of_week, meal });

  if (error) throw new Error(error.message);
  await notifyParents_mealRequest(member_name, meal, DAYS[day_of_week]);
  revalidatePath("/supermarket");
}

export async function updateMealEntry(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const meal = formData.get("meal") as string;
  const member_name = (formData.get("member_name") as string) || "";
  const day_of_week = Number(formData.get("day_of_week") ?? 0);

  const { error } = await supabase
    .from("meal_plan")
    .update({ meal, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (member_name) {
    await notifyParents_mealRequest(member_name, meal, DAYS[day_of_week]);
  }
  revalidatePath("/supermarket");
}

export async function deleteMealEntry(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("meal_plan").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/supermarket");
}

// ── Meal Ingredients ────────────────────────────────

export async function getMealIngredients(meal: string) {
  const supabase = await requireAuth();
  const { data } = await supabase
    .from("meal_ingredients")
    .select("item_name, quantity")
    .eq("meal", meal.toLowerCase().trim());
  return data ?? [];
}

export async function addMealToShoppingList(formData: FormData) {
  const supabase = await requireAuth();
  const list_id = safeId(formData, "list_id");
  const meal = (formData.get("meal") as string).toLowerCase().trim();
  const itemsJson = formData.get("items") as string;
  const items: { name: string; quantity: string }[] = safeJsonArray(itemsJson);

  if (items.length === 0) return;

  // Batch category lookup
  const itemNamesLower = items.map((i) => i.name.toLowerCase());
  const { data: categories } = await supabase
    .from("item_categories")
    .select("name, category")
    .in("name", itemNamesLower);

  const categoryMap = new Map((categories ?? []).map((c) => [c.name, c.category]));

  // Batch insert shopping items
  const shoppingRows = items.map((item) => ({
    list_id,
    name: item.name,
    quantity: item.quantity || null,
    category: categoryMap.get(item.name.toLowerCase()) ?? null,
    checked: false,
  }));
  await supabase.from("shopping_items").insert(shoppingRows);

  // Batch upsert meal_ingredients
  const ingredientRows = items.map((item) => ({
    meal,
    item_name: item.name.toLowerCase().trim(),
    quantity: item.quantity || null,
  }));
  await supabase
    .from("meal_ingredients")
    .upsert(ingredientRows, { onConflict: "meal,item_name" });

  revalidatePath("/supermarket");
}

// ── Chores ──────────────────────────────────────────

export async function addChore(formData: FormData) {
  const supabase = await requireAuth();
  const name = requireString(formData, "name");
  const frequency = formData.get("frequency") as string;
  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("chores")
    .insert({ name, frequency, assignee });

  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function updateChore(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const name = requireString(formData, "name");
  const frequency = formData.get("frequency") as string;
  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("chores")
    .update({ name, frequency, assignee })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function deleteChore(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("chores").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function completeChore(formData: FormData) {
  const { supabase, member } = await getCurrentMember();
  const id = safeId(formData, "id");
  const { error } = await supabase
    .from("chores")
    .update({ last_completed: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Notify parents if a kid completed a chore
  const choreName = formData.get("chore_name") as string;
  const assignee = formData.get("assignee") as string;
  if (assignee && member.role === "kid" && choreName) {
    await notifyParents(assignee, choreName);
  }

  revalidatePath("/chores");
}

// ── Kids' Chore Schedule ────────────────────────────

export async function addScheduleEntry(formData: FormData) {
  const supabase = await requireAuth();
  const kid_name = requireString(formData, "kid_name");
  const chore_name = requireString(formData, "chore_name");
  const day_of_week = Number(formData.get("day_of_week"));
  const time_of_day = (formData.get("time_of_day") as string) || null;

  const { error } = await supabase
    .from("chore_schedule")
    .insert({ kid_name, chore_name, day_of_week, time_of_day });

  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function updateScheduleEntry(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const chore_name = requireString(formData, "chore_name");
  const time_of_day = (formData.get("time_of_day") as string) || null;

  const { error } = await supabase
    .from("chore_schedule")
    .update({ chore_name, time_of_day, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function deleteScheduleEntry(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("chore_schedule").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/chores");
}

export async function completeScheduleEntry(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase
    .from("chore_schedule")
    .update({ last_completed: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Notify parents when a kid completes a schedule entry
  const kid_name = formData.get("kid_name") as string;
  const chore_name = formData.get("chore_name") as string;
  if (kid_name && chore_name) {
    await notifyParents(kid_name, chore_name);
  }

  revalidatePath("/chores");
}

export async function subscribeToPush(formData: FormData) {
  const supabase = await requireAuth();
  const member_name = formData.get("member_name") as string;
  const endpoint = formData.get("endpoint") as string;
  const p256dh = formData.get("p256dh") as string;
  const auth = formData.get("auth") as string;

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ member_name, endpoint, p256dh, auth }, { onConflict: "endpoint" });

  if (error) throw new Error(error.message);
}

// ── School Tests ────────────────────────────────────

export async function addSchoolTest(formData: FormData) {
  const supabase = await requireAuth();
  const kid_name = requireString(formData, "kid_name");
  const subject = requireString(formData, "subject");
  const test_date = requireString(formData, "test_date");
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase
    .from("school_tests")
    .insert({ kid_name, subject, test_date, notes });

  if (error) throw new Error(error.message);
  revalidatePath("/school-tests");
}

export async function updateSchoolTest(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const subject = requireString(formData, "subject");
  const test_date = requireString(formData, "test_date");
  const notes = (formData.get("notes") as string) || null;
  const grade = (formData.get("grade") as string) || null;

  const { error } = await supabase
    .from("school_tests")
    .update({ subject, test_date, notes, grade, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/school-tests");
}

export async function deleteSchoolTest(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("school_tests").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/school-tests");
}

// ── Home Projects ───────────────────────────────────

export async function addProject(formData: FormData) {
  const supabase = await requireAuth();
  const name = requireString(formData, "name");
  const description = (formData.get("description") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const status = (formData.get("status") as string) || "planned";
  const due_date = (formData.get("due_date") as string) || null;

  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("projects")
    .insert({ name, description, notes, status, due_date, assignee });

  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

export async function updateProject(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const name = requireString(formData, "name");
  const status = formData.get("status") as string;
  const description = (formData.get("description") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const due_date = (formData.get("due_date") as string) || null;
  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("projects")
    .update({ name, status, description, notes, due_date, assignee })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

export async function deleteProject(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

// ── Project Tasks ───────────────────────────────────

export async function addProjectTask(formData: FormData) {
  const supabase = await requireAuth();
  const project_id = safeId(formData, "project_id");
  const name = requireString(formData, "name");
  const due_date = (formData.get("due_date") as string) || null;
  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("project_tasks")
    .insert({ project_id, name, due_date, assignee });

  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

export async function toggleProjectTask(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const done = formData.get("done") === "true";

  const { error } = await supabase
    .from("project_tasks")
    .update({ done: !done })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
}

export async function updateProjectTask(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const name = requireString(formData, "name");
  const due_date = (formData.get("due_date") as string) || null;
  const assignee = (formData.get("assignee") as string) || null;

  const { error } = await supabase
    .from("project_tasks")
    .update({ name, due_date, assignee })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

export async function deleteProjectTask(formData: FormData) {
  const supabase = await requireAuth();
  const id = safeId(formData, "id");
  const { error } = await supabase.from("project_tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home-projects");
  revalidatePath("/calendar");
}

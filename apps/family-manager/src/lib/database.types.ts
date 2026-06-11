export interface Event {
  id: number;
  title: string;
  description: string | null;
  start_date: string;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  assignee: string | null;
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  repeat_end_date: string | null;
  invitees: string[];
  external_emails: string[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: number;
  name: string;
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: number;
  list_id: number;
  name: string;
  quantity: string | null;
  category: string | null;
  notes: string | null;
  checked: boolean;
  created_at: string;
}

export interface Chore {
  id: number;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  assignee: string | null;
  last_completed: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  status: "planned" | "in-progress" | "done";
  description: string | null;
  notes: string | null;
  due_date: string | null;
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: number;
  project_id: number;
  name: string;
  done: boolean;
  due_date: string | null;
  assignee: string | null;
  created_at: string;
}

export interface ChoreScheduleEntry {
  id: number;
  kid_name: string;
  chore_name: string;
  day_of_week: number; // 0=Sun, 6=Sat
  time_of_day: string | null;
  last_completed: string | null;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: number;
  member_name: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface MealPlanEntry {
  id: number;
  day_of_week: number; // 0=Sun, 6=Sat
  member_name: string;
  meal: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleCalendarLink {
  id: number;
  member_name: string;
  ical_url: string;
  created_at: string;
}

export interface ItemCategory {
  id: number;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: number;
  email: string;
  name: string;
  role: "parent" | "kid";
  created_at: string;
}

export interface SchoolTest {
  id: number;
  kid_name: string;
  subject: string;
  test_date: string;
  notes: string | null;
  grade: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMessage {
  id: number;
  author: string;
  message: string;
  pinned: boolean;
  channel: "family" | "parents";
  created_at: string;
}

export interface MealIngredient {
  id: number;
  meal: string;
  item_name: string;
  quantity: string | null;
  created_at: string;
}

export interface CalendarEntry {
  id: string;
  title: string;
  date: string;
  time: string | null;
  type: "event" | "project" | "task" | "google" | "test";
  source_id: number;
  repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  memberName?: string;
}

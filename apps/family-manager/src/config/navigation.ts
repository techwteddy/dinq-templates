export interface NavArea {
  name: string;
  href: string;
  icon: string;
  description: string;
}

export const navAreas: NavArea[] = [
  {
    name: "Calendar",
    href: "/calendar",
    icon: "📅",
    description: "View and manage your schedule",
  },
  {
    name: "Supermarket",
    href: "/supermarket",
    icon: "🛒",
    description: "Shopping lists and meal planning",
  },
  {
    name: "Chores",
    href: "/chores",
    icon: "🧹",
    description: "Household tasks and assignments",
  },
  {
    name: "Home Projects",
    href: "/home-projects",
    icon: "🔨",
    description: "Track home improvement projects",
  },
  {
    name: "School Tests",
    href: "/school-tests",
    icon: "📝",
    description: "Track upcoming tests and grades",
  },
  {
    name: "Messages",
    href: "/messages",
    icon: "💬",
    description: "Family message board",
  },
];

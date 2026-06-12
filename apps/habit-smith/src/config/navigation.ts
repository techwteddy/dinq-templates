export type NavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Habits", href: "/dashboard/habits" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Social", href: "/dashboard/social" },
  { label: "Leaderboard", href: "/dashboard/leaderboard" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" },
];

export const FREE_PLAN_LIMITS = {
  habits: 5,
  analytics: "basic",
  socialConnections: 5,
} as const;

export const PREMIUM_PLAN_FEATURES = {
  habits: "unlimited",
  analytics: "advanced",
  socialConnections: "unlimited",
  premiumThemes: true,
  accountabilityGroups: "coming_soon",
} as const;

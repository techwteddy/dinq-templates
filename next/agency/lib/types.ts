import { links } from "./data";

export type SectionName = (typeof links)[number]["name"];

export interface EngagementTier {
  name: string;
  idealFor: string;
  scopeExamples: string[];
  timeline: string;
  collaborationStyle: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface Testimonial {
  quote: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  metric?: string;
}

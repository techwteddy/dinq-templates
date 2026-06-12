import { HelpCircle, Activity, Heart, FileText, LucideIcon } from "lucide-react";

export interface FAQItemEn {
  id: string;
  category: "rehab" | "palliative" | "docs" | "general";
  question: string;
  answer: string;
}

export interface FAQCategoryEn {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const faqData: FAQItemEn[] = [
  {
    id: "free-services",
    category: "general",
    question: "Are services at your center free?",
    answer: "Yes, all medical rehabilitation and palliative care services are completely free for children. They are funded by the National Health Service of Ukraine (NHSU) under corresponding medical guarantee packages, provided you have an active electronic referral.",
  },
  {
    id: "get-referral",
    category: "docs",
    question: "How do I get an electronic referral to the center?",
    answer: "An electronic referral can be issued by the child's pediatrician, family doctor, or attending specialist physician (neurologist, orthopedist, surgeon, etc.) after consultation. The referral must be registered in the eHealth system for a consultation with a PRM (Physical and Rehabilitation Medicine) doctor or for a specific rehabilitation/palliative package.",
  },
  {
    id: "prm-doctor",
    category: "rehab",
    question: "Who is a PRM doctor and what is their role?",
    answer: "A PRM (Physical and Rehabilitation Medicine) doctor is the lead specialist heading the multidisciplinary rehabilitation team. They perform the initial examination of the child, assess rehabilitation potential, prescribe specific therapies/sessions, coordinate physical and occupational therapists, and evaluate recovery progress.",
  },
  {
    id: "palliative-definition",
    category: "palliative",
    question: "What does palliative care involve and who can receive it?",
    answer: "Palliative care aims to improve the quality of life for children suffering from severe incurable diseases and support their families. It includes adequate pain relief, symptom management, medical supervision, psychological, and social support.",
  },
  {
    id: "hospitalization-docs",
    category: "docs",
    question: "What documents are required for admission?",
    answer: "For admission of a child to the inpatient or outpatient department, you must provide: 1) Child birth certificate and parent/guardian ID; 2) Active electronic referral; 3) Detailed medical extract (Form 027/o) with recent lab test results and findings from specialists.",
  },
  {
    id: "rehab-duration",
    category: "rehab",
    question: "How long does a rehabilitation course last?",
    answer: "A standard rehabilitation course under the NHSU package in the inpatient department lasts 14 to 21 calendar days, depending on the diagnosis (neurological disorders, states after injuries or surgeries). Outpatient rehabilitation also takes about 2 weeks and can be adjusted by the PRM doctor based on the child's condition.",
  },
  {
    id: "mobile-palliative",
    category: "palliative",
    question: "Does the center provide palliative care at home?",
    answer: "Yes, our center operates a mobile palliative care service. A multidisciplinary team (physician, nurse, psychologist) conducts regular home visits to the child for assessment, symptoms/pain therapy adjustment, caregiver training, and psychological counseling.",
  },
];

export const categories: FAQCategoryEn[] = [
  { id: "all", label: "All questions", icon: HelpCircle },
  { id: "rehab", label: "Rehabilitation", icon: Activity },
  { id: "palliative", label: "Palliative Care", icon: Heart },
  { id: "docs", label: "Documents & Booking", icon: FileText },
];

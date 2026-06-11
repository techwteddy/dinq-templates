import { DemoTriggerType } from '@/components/DemoModal';

export interface DemoContent {
  title: string;
  description: string;
}

/**
 * Configuration for demo modal content based on trigger types.
 * These are used to provide contextual information to users in the demo environment.
 */
export const DEMO_MODAL_CONTENT: Record<DemoTriggerType, DemoContent> = {
  social: {
    title: 'External Social Link',
    description:
      'In the production version, this would redirect you to the official social media platform.',
  },
  navigation: {
    title: 'Navigation Placeholder',
    description:
      'This link would normally take you to another page within the application.',
  },
  form: {
    title: 'Form Submission Demo',
    description:
      'This action would typically process and submit your form data to our backend services.',
  },
  feature: {
    title: 'Feature Preview',
    description:
      'This exciting new feature is currently under development and will be available soon.',
  },
  external: {
    title: 'External Link Intercepted',
    description:
      'This link leads to an external website and has been intercepted for this demo.',
  },
};

/**
 * Optional overrides or specific content for certain demo scenarios.
 * This can be extended to include more specific demo content as needed.
 */
export const DEMO_CONTENT_OVERRIDES = {
  login: {
    title: 'Login Simulation',
    description:
      'We are simulating the login process. In production, this would securely authenticate you.',
  },
  signup: {
    title: 'Account Creation Demo',
    description:
      'This is a demonstration of our signup flow. Real account creation is disabled in this preview.',
  },
  payment: {
    title: 'Payment Integration',
    description:
      'This would normally initiate a secure payment transaction with our payment provider.',
  },
} as const;

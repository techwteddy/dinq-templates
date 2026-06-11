/**
 * Placeholder image configuration using DiceBear API and local assets.
 */

import { getAssetPath } from './utils';

export const PLACEHOLDER_IMAGES = {
  hero: {
    get home() {
      return getAssetPath('/images/hero-home.jpg');
    },
    get about() {
      return getAssetPath('/images/hero-about.jpg');
    },
  },
  courses: {
    get default() {
      return getAssetPath('/images/courses/course-cs101.jpg');
    },
  },
  profiles: {
    faculty: (seed: string) =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    student: (seed: string) =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    fallback: {
      get faculty() {
        return getAssetPath('/images/faculty/faculty-1.jpg');
      },
      get student() {
        return getAssetPath('/images/faculty/faculty-2.jpg');
      },
    },
  },
};

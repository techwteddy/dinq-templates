'use server';

import { signOut } from '@/auth';

export const adminSignOut = async () => {
  await signOut();
};

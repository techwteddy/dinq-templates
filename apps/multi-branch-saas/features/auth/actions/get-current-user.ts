'use server'

import { getCurrentUser } from '../utils'

export async function getCurrentUserAction() {
  return await getCurrentUser()
}

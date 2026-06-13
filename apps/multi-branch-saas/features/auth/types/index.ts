export type ActionResult<T = void> = {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export type AuthUser = {
  id: string
  email: string
  fullName: string
  phone?: string
  branchId: string
  status: string
}

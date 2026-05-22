import type { UserRole } from './enums'

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  athleteId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

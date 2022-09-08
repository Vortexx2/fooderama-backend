import { JwtPayload } from 'jsonwebtoken'
// Imports above

export interface UserInAccessJwt extends JwtPayload {
  userId: number
  email: string
  role: string
  activated: boolean
  // blacklisted: boolean
}

export interface UserInEmailJwt extends JwtPayload {
  userId: number
}

export type Roles = 'user' | 'manager' | 'admin'

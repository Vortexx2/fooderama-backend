import { JwtPayload } from 'jsonwebtoken'
// Imports above

export interface UserInJwt extends JwtPayload {
  userId: number
  email: string
  role: string
}

export type Roles = 'user' | 'manager' | 'admin'

export interface UserInJwt {
  userId: number
  email: string
  role: string
}

export type Roles = 'user' | 'manager' | 'admin'

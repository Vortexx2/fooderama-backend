import { Request } from 'express'
import { UserInAccessJwt } from './users'

// Imports above

// export type JSONBody = { [key: string]: any } | { [key: string]: any }[]
export type JSONBody = Record<string, any> | Record<string, any>[]

export interface RequestWithUser extends Request {
  user?: UserInAccessJwt
}

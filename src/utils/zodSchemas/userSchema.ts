import { z } from 'zod'

import { userValidationConfig as config } from '@constants/users'

// Imports above

export const zUser = z.object({
  email: z.string().trim().max(config.MAX_EMAIL_LEN).regex(config.EMAIL_REGEX),
  password: z
    .string()
    .trim()
    .min(config.MIN_PASSWORD_LEN)
    .max(config.MAX_PASSWORD_LEN),
})

export type zUserType = z.infer<typeof zUser>

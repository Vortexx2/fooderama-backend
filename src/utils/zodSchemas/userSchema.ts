import { z } from 'zod'

import { userValidationConfig as config } from '@constants/users'
import validator from 'validator'

// Imports above

export const zUser = z.object({
  email: z.string().trim().max(config.MAX_EMAIL_LEN).regex(config.EMAIL_REGEX),
  password: z
    .string()
    .trim()
    .min(config.MIN_PASSWORD_LEN)
    .max(config.MAX_PASSWORD_LEN)
    .refine(
      pass =>
        validator.isStrongPassword(pass, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 0,
          minNumbers: 1,
          minSymbols: 0,
          returnScore: false,
        }),
      {
        message:
          'Password must be minimum 6 characters in length with minimum 1 lowercase and 1 numerical character',
      }
    ),
})

export type zUserType = z.infer<typeof zUser>

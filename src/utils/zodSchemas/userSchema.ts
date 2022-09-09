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
          minLength: config.MIN_PASSWORD_LEN,
          minLowercase: 0,
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

//** Used to parse the incoming cookies */
export const zUserCookies = z.object({
  refresh_token: z.string().trim().regex(config.JWT_REGEX),
  userId: z
    .string()
    .trim()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10)

      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'userId is not a number',
        })
      }

      return parsed
    }),
})

export const zUserResponse = zUser.omit({ password: true }).extend({
  userId: z.number().int().nonnegative(),
  role: z.nullable(z.string()),
  confirmed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// export const zUserUpdate = zUser.extend({
//   userId: z.number().int().nonnegative(),
//   role: z.nullable(z.string()),
//   confirmed: z.boolean(),
// })

export type zUserType = z.infer<typeof zUser>

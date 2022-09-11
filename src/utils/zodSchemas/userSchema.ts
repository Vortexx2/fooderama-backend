import { z } from 'zod'

import { userValidationConfig as config } from '@constants/users'
import validator from 'validator'

// Imports above

export const zUser = z.object({
  email: z
    .string()
    .trim()
    .max(config.MAX_EMAIL_LEN, {
      message: 'Email must have at most 256 characters',
    })
    .regex(config.EMAIL_REGEX, {
      message: 'Email is not valid',
    }),
  password: z
    .string()
    .min(
      config.MIN_PASSWORD_LEN,
      `Password must be at least ${config.MIN_PASSWORD_LEN} characters in length`
    )
    .max(
      config.MAX_PASSWORD_LEN,
      `Password must be less than ${config.MAX_PASSWORD_LEN} characters in length`
    )
    .regex(
      config.PASSWORD_REGEX,
      'Password must have at least 1 character and 1 number'
    ),
})

//** Used to parse the incoming cookies */
export const zUserCookies = z.object({
  refreshToken: z.string().trim().regex(config.JWT_REGEX),
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

export type zUserType = z.infer<typeof zUser>

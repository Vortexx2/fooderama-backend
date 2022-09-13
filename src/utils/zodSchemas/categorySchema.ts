import { z } from 'zod'

import { categoryValidationConfig as config } from '@constants/categories'
import { zDish } from './dishSchema'

// Imports above

/** Zod object for validation of categories that will be created */
export const zCategory = z.object({
  restId: z.number().int().nonnegative(),
  categoryName: z
    .string()
    .trim()
    .min(config.MIN_CATEGORY_LEN)
    .max(config.MAX_CATEGORY_LEN),
  sortId: z.number().int().nonnegative(),
  Dishes: z.array(zDish).optional(),
})

export type zCategoryType = z.infer<typeof zCategory>

export const zCategoryArray = z.array(zCategory)

export type zCategoryArrayType = z.infer<typeof zCategoryArray>

export const zUpdateCategory = zCategory
  .omit({ restId: true })
  .partial()
  .strict()

export type zUpdateCategoryType = z.infer<typeof zUpdateCategory>

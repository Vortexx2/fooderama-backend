import { z } from 'zod'

import { categoryValidationConfig as config } from '@constants/categories'

// Imports above

/** Zod object for validation of categories that will be created */
export const zCategory = z.object({
  restId: z.number().int().nonnegative(),
  categoryName: z
    .string()
    .trim()
    .min(config.MIN_CATEGORY_LEN)
    .max(config.MAX_CATEGORY_LEN),
})

export type zCategoryType = z.infer<typeof zCategory>

import { z } from 'zod'

import { cuisineValidationConfig as config } from '@constants/restaurants'
// Imports above

/**
 * Zod schema for request body when creating a cuisine
 */
export const zCuisine = z.object({
  cuisineName: z
    .string()
    .min(config.MIN_CUISINE_LEN)
    .max(config.MAX_CUISINE_LEN),
})

export type zCuisineType = z.infer<typeof zCuisine>

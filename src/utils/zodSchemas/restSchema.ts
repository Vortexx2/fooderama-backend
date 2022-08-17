import { z } from 'zod'

import { restValidationConfig } from '@constants/restaurants'
// Imports above

const {
  MIN_REST_LEN,
  MAX_REST_LEN,
  MIN_DESC_LEN,
  MAX_DESC_LEN,
  MIN_RATING,
  MAX_RATING,
  MAX_CUISINES_CREATION,
} = restValidationConfig

/**
 * The zod restaurant schema.
 */
export const zRestaurant = z.object({
  restName: z.string().trim().min(MIN_REST_LEN).max(MAX_REST_LEN),
  restImage: z.string().trim().url().optional(),
  description: z.string().trim().min(MIN_DESC_LEN).max(MAX_DESC_LEN).optional(),
  open: z.boolean().optional(),
  rating: z.number().gte(MIN_RATING).lte(MAX_RATING).optional(),
  openingTime: z.string().trim().optional(),
  closingTime: z.string().trim().optional(),
})

/**
 * The zod schema for the `Cuisines` array that will be provided when creating a new restaurant or adding cuisines to an existing restaurant.
 */
export const zCuisinesArray = z
  .array(z.object({ cuisineId: z.number().int().nonnegative() }).strict())
  .max(MAX_CUISINES_CREATION)

/**
 * The zod Restaurant array schema.
 */
export const zRestaurantArray = z.array(zRestaurant)

export type zRestaurantType = z.infer<typeof zRestaurant>
export type zRestaurantArrayType = z.infer<typeof zRestaurantArray>

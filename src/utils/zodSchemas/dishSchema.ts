import { z } from 'zod'

import { dishValidationConfig as config } from '@constants/restaurants'

// Imports above

/** Validation object for dishes */
export const zDish = z.object({
  dishName: z
    .string()
    .trim()
    .min(config.MIN_DISH_LEN)
    .max(config.MAX_DISH_LEN)
    .transform(dish =>
      dish
        .split(' ')
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ')
    ),
  price: z.number().int().positive().max(config.MAX_PRICE),
  sortId: z.number().int().nonnegative(),
})

export type zDishType = z.infer<typeof zDish>

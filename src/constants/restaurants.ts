/** Config object for validation of a restaurant while storing it in the database and while validating request body */
export const restValidationConfig = {
  MIN_REST_LEN: 3,
  MAX_REST_LEN: 32,
  MIN_DESC_LEN: 4,
  MAX_DESC_LEN: 256,
  MIN_RATING: 0,
  MAX_RATING: 5,
  MAX_CUISINES_CREATION: 5,
}

/** Config object for validation of a cuisine while storing it in the database and while validating request body */
export const cuisineValidationConfig = {
  MIN_CUISINE_LEN: 4,
  MAX_CUISINE_LEN: 16,
}

export const categoryValidationConfig = {
  MIN_CAT_LEN: 3,
  MAX_CAT_LEN: 50,
  MIN_DESC_LEN: 5,
  MAX_DESC_LEN: 256,
}

export const dishValidationConfig = {
  MIN_DISH_LEN: 3,
  MAX_DISH_LEN: 32,
  MIN_DESC_LEN: 4,
  MAX_DESC_LEN: 256,
  MAX_PRICE: 2048,
}

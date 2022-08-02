interface RestaurantValidationConfig {
  readonly MIN_REST_LEN: number
  readonly MAX_REST_LEN: number
  readonly MIN_DESC_LEN: number
  readonly MAX_DESC_LEN: number
  readonly MIN_RATING: number
  readonly MAX_RATING: number
}

export const restValidationConfig: RestaurantValidationConfig = {
  MIN_REST_LEN: 3,
  MAX_REST_LEN: 32,
  MIN_DESC_LEN: 4,
  MAX_DESC_LEN: 256,
  MIN_RATING: 0,
  MAX_RATING: 5,
}

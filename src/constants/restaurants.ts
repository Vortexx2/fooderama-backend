interface RestaurantValidationConfig {
  readonly MIN_REST_LEN: number;
  readonly MAX_REST_LEN: number;
  readonly MIN_DESC_LEN: number;
  readonly MAX_DESC_LEN: number;
  readonly MIN_RATING: number;
  readonly MAX_RATING: number;
}

export const restValidationConfig: RestaurantValidationConfig = {
  MIN_REST_LEN: 3,
  MAX_REST_LEN: 32,
  MIN_DESC_LEN: 4,
  MAX_DESC_LEN: 256,
  MIN_RATING: 0,
  MAX_RATING: 5,
};

interface MenuValidationConfig {
  readonly MIN_DISH_LEN: number;
  readonly MAX_DISH_LEN: number;
  readonly MIN_DESC_LEN: number;
  readonly MAX_DESC_LEN: number;
}

export const menuValidationConfig: MenuValidationConfig = {
  MIN_DISH_LEN: 3,
  MAX_DISH_LEN: 32,
  MIN_DESC_LEN: 4,
  MAX_DESC_LEN: 256,
};

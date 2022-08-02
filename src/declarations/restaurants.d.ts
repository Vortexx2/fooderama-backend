export interface BaseRestaurant {
  restName: string
  description?: string
  open?: boolean
  rating?: number
  openingTime?: Date
  closingTime?: Date
}

export interface Restaurant extends BaseRestaurant {
  id: number
  createdAt: Date
  updatedAt: Date
}

import { Restaurant } from '@models/restaurants.model'

export interface BaseRestaurant {
  restName: string
  description?: string
  open?: boolean
  rating?: number
  openingTime?: Date
  closingTime?: Date
}

export interface FullRestaurant extends BaseRestaurant {
  restId: number
  createdAt: Date
  updatedAt: Date
}

export type RestObjOrArr<T extends BaseRestaurant | BaseRestaurant[]> =
  T extends BaseRestaurant ? Restaurant : Restaurant[]

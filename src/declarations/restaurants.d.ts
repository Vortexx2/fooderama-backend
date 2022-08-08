import { Restaurant } from '@models/restaurants.model'

export interface BaseRestaurant {
  restName: string
  description?: string
  open?: boolean
  rating?: number
  openingTime?: string
  closingTime?: string
}

export interface FullRestaurant extends BaseRestaurant {
  restId: number
  createdAt: string
  updatedAt: string
}

export type RestObjOrArr<T extends BaseRestaurant | BaseRestaurant[]> =
  T extends BaseRestaurant ? Restaurant : Restaurant[]

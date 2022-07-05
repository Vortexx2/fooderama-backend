import * as restService from './restaurants.service';
import * as restaurants from '@constants/rest-mock-data.json';
import { BaseRestaurant } from '@declarations/restaurants';
import { Restaurant } from '@models/restaurants/restaurants.model';

function restaurantObjectProperties() {
  return [
    'id',
    'restName',
    'description',
    'open',
    'rating',
    'openingTime',
    'closingTime',
  ];
}

describe('restaurant service', () => {
  it('should resolve with true (table has 0 records)', async () => {
    expect.assertions(1);
    const res = await restService.findAll();
    expect(res.length).toBe(0);
  });

  test('find service when no records exist', async () => {
    expect.assertions(1);
    const res = await restService.find(Math.random() * 100);
    expect(res).toBeNull();
  });

  test('create service when we add only 1 record', async () => {
    const restProps: string[] = restaurantObjectProperties();

    expect.assertions(restProps.length);

    const payload: Object = restaurants[0];
    const res = await restService.create(payload as BaseRestaurant);

    restProps.map((prop: string) => {
      expect(res).toHaveProperty(prop);
    });
  });

  test('create service with multiple records', async () => {
    console.log(restaurants);
    const payload: Object[] = restaurants.slice(1);
    const res = await restService.create(payload as BaseRestaurant[]);

    expect((res as Restaurant[]).length).toBe(payload.length);
  });
});

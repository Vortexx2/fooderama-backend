import { assignPropsToObject } from './routes.utils'

// imports above

describe('check route util functions', () => {
  test('assign props to object', () => {
    const inpObject = {
      a: 1,
      b: '123',
      c: {
        d: [1, 2, 3],
      },
    }

    const props = ['a', 'c']
    const expectedObject = {
      a: inpObject['a'],
      c: inpObject['c'],
    }

    expect(assignPropsToObject(props, inpObject)).toEqual(expectedObject)
  })
})

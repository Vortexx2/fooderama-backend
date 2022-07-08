/**
 * Takes all properties listed in `propArray` and returns a new `Object` with those properties.
 * @param propArr array of properties to take from `obj` and return a new `Object` with those properties.
 * @param obj `Object` to take the key value pairs from
 */
export function assignPropsToObject(
  propArr: string[],
  obj: { [key: string]: any }
) {
  let resObject: { [key: string]: any } = {};
  propArr.map((prop: string) => {
    if (obj.hasOwnProperty(prop)) {
      resObject[prop] = obj[prop];
    }
  });

  return resObject;
}

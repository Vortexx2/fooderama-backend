/**
 * Checks the mentioned fields on the objects in the array to check if they are in ascending order
 * @param objArr Array of objects off of which we will check the ids from
 * @param fieldToCheck the reference to the field to check
 * @returns true if it is in ascending order, else false
 */
export function checkIfAscIds(
  objArr: Record<string, any>[],
  fieldToCheck: string
): boolean {
  if (!objArr.length) return true

  // previous id in the iterations
  let prevId: number = objArr[0][fieldToCheck]

  for (let i = 1; i < objArr.length; i++) {
    const currId: number = objArr[i][fieldToCheck]

    // if current id is lesser, it's not strictly increasing
    if (currId < prevId) return false

    prevId = currId
  }

  return true
}

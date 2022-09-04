import { Request, Response, NextFunction } from 'express'
import { BadRequest } from '../errors/errors'
// Imports above

/**
 * Validates if all numerical parameters that are in the path are valid numerical values.
 * @param ids the ids that you want to check from the path to be valid numbers
 * @returns nothing
 */
export function checkNumericalParams(...ids: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      ids.forEach(id => {
        const numericalId = parseInt(req.params[id], 10)

        if (isNaN(numericalId))
          throw new BadRequest(`Bad parameter in path: ${id}`)

        next()
      })
    } catch (error: any) {
      next(error)
    }
  }
}

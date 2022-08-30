import { Unauthorized } from 'errors'
import { userValidationConfig as config } from '@constants/users'
// Imports above

/**
 * Extracts the JWT from the provided string. Does basic checks on the string if it has valid length and the first word is 'Bearer' or not.
 * @param authHeader basically `req.headers['authorization']`
 * @returns The token if successful
 * @throws Unauthorized if not successful
 */
export function getJWTFromHeader(authHeader: string | undefined) {
  if (!authHeader) {
    throw new Unauthorized('No valid JWT provided')
  }

  const wordArray = authHeader.split(' ')

  if (
    wordArray.length === 2 &&
    wordArray[0] === 'Bearer' &&
    wordArray[1].match(config.JWT_REGEX)
  ) {
    return wordArray[1]
  } else {
    throw new Unauthorized('Invalid authorization header')
  }
}

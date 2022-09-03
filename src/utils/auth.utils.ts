import jwt from 'jsonwebtoken'

import { Unauthorized } from 'errors'
import { userValidationConfig as config } from '@constants/users'
import { User } from '@models/users.model'
// Imports above

/**
 * Utility mehtod to easily create a JWT token.
 * @param user the user object that is supposed to be serialised in teh JWT
 * @param key the key with which we sign the JWT
 * @param expiry (optional) the amount of time it takes for the token to expire. If not passed, the token never expires
 * @returns the JWT token
 */
export function createToken(
  user: { userId: number; email: string },
  key: string,
  expiry?: string
) {
  // options that are supposed to be passed to `jwt.sign`
  const options: jwt.SignOptions = {
    algorithm: 'RS256',
  }

  if (expiry) {
    options.expiresIn = expiry
  }

  return jwt.sign(user, key, options)
}

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

/**
 * Function to check if the `refreshToken` provided is valid or not. Currently it checks if the refresh token stored in the database matches the one provided. In the future it will check if the user is blacklisted or not.
 * @param user the user that is stored in the database
 * @param refreshToken the refresh token to compare the token with which is stored in the database
 * @returns true if it is a valid token associated with the current user, else false
 */
export function canRefreshAccess(user: User, refreshToken: string) {
  return refreshToken === user.refreshToken
}

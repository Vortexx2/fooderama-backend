/** Config object for validation of a user while storing it in the database and while validating request body */
export const userValidationConfig = {
  EMAIL_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  MAX_EMAIL_LEN: 256,
  MIN_PASSWORD_LEN: 6,
  MAX_PASSWORD_LEN: 30,
}

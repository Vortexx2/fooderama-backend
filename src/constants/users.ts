/** Config object for validation of a user while storing it in the database and while validating request body */
export const userValidationConfig = {
  EMAIL_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
  MAX_EMAIL_LEN: 256,
  MIN_PASSWORD_LEN: 6,
  MAX_PASSWORD_LEN: 30,
  JWT_REGEX: /\S*\.\S*\.\S*/,
}

export const roleValidationConfig = {
  MAX_ROLE_LENGTH: 20,
}

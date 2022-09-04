export interface CustomErrorJSON {
  name: string
  message: string
  code: number
  className: string
  data?: any
  errors?: any
}

export type DynamicError = Error & { [key: string]: any }
export type ErrorMessage =
  | string
  | DynamicError
  | { [key: string]: any }
  | any[]

interface ErrorProperties extends Omit<CustomErrorJSON, 'message'> {
  type: string
}

export class CustomError extends Error {
  readonly type!: string
  readonly code!: number
  readonly className!: string
  readonly data: any
  readonly errors: any

  constructor(
    err: ErrorMessage | undefined,
    name: string,
    code: number,
    className: string,
    _data: any
  ) {
    let msg = typeof err === 'string' ? err : 'Error'
    const properties: ErrorProperties = {
      name,
      code,
      className,
      type: 'CustomError',
    }

    if (Array.isArray(_data)) {
      properties.data = _data
    } else if (typeof err === 'object' || _data !== undefined) {
      const { message, errors, ...rest } = typeof err === 'object' ? err : _data

      msg = message || msg
      properties.errors = errors
      properties.data = rest
    }

    super(msg)
    Object.assign(this, properties)
  }

  toJSON() {
    const result: CustomErrorJSON = {
      name: this.name,
      message: this.message,
      code: this.code,
      className: this.className,
    }

    if (this.data !== undefined) result.data = this.data
    if (this.errors !== undefined) result.errors = this.errors

    return result
  }
}

// 400 - Bad Request (Validation Error)
export class ValidationError extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'ValidationError', 400, 'validation-error', data)
  }
}

// 400 - Bad Request
export class BadRequest extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'BadRequest', 400, 'bad-request', data)
  }
}

// 401 - Not Authenticated
export class Unauthorized extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'NotAuthenticated', 401, 'not-authenticated', data)
  }
}

// 403 - Forbidden
export class Forbidden extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'Forbidden', 403, 'forbidden', data)
  }
}

// 404 - Not Found
export class NotFound extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'NotFound', 404, 'not-found', data)
  }
}

// 405 - Method Not Allowed
export class MethodNotAllowed extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'MethodNotAllowed', 405, 'method-not-allowed', data)
  }
}

// 408 - Timeout
export class Timeout extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'Timeout', 408, 'timeout', data)
  }
}

// 429 Too Many Requests
export class TooManyRequests extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'TooManyRequests', 429, 'too-many-requests', data)
  }
}

// 500 - General Error
export class GeneralError extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'GeneralError', 500, 'general-error', data)
  }
}

// 501 - Not Implemented
export class NotImplemented extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'NotImplemented', 501, 'not-implemented', data)
  }
}

// 502 - Bad Gateway
export class BadGateway extends CustomError {
  constructor(message?: ErrorMessage, data?: any) {
    super(message, 'BadGateway', 502, 'bad-gateway', data)
  }
}

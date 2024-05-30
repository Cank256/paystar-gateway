export const StatusCodes = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    HTTP_GATEWAY_TIMEOUT: 504,
}

export const ErrorMessages = {
    NOT_FOUND: 'Resource Not found',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    UNPROCESSABLE_ENTITY: 'Unprocessable entity',
    WRONG_PAYMENT_METHOD: 'Wrong payment method. Use card or momo',
    INVALID_PHONE_NUMBER: 'Invalid phone number or unsupported phone network',
}

export const PaymentMethods = {
    CARD: 'card',
    MOMO: 'momo',
}

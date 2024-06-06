// StatusCodes: HTTP status codes for various responses
export const StatusCodes = {
    OK: 200,                          // Successful HTTP request
    CREATED: 201,                     // Resource has been created
    ACCEPTED: 202,                    // Request has been accepted for processing
    BAD_REQUEST: 400,                 // Client-side input fails validation
    NOT_FOUND: 404,                   // Resource not found
    UNAUTHORIZED: 401,                // Authentication is required and has failed or not been provided
    UNPROCESSABLE_ENTITY: 422,        // Server understands the content type of the request entity, but the request entity has semantical errors
    INTERNAL_SERVER_ERROR: 500,       // Generic server error
    SERVICE_UNAVAILABLE: 503,         // Server is currently unavailable (overloaded or down)
    HTTP_GATEWAY_TIMEOUT: 504,        // Server did not receive a timely response from an upstream server
};

// ErrorMessages: Standard error messages used throughout the application
export const ErrorMessages = {
    NOT_FOUND: 'Resource Not found',                                      // Error message for resource not found
    UNAUTHORIZED: 'Unauthorized',                                         // Error message for unauthorized access
    FORBIDDEN: 'Forbidden',                                               // Error message for forbidden access
    INTERNAL_SERVER_ERROR: 'Internal server error',                       // Error message for server-side error
    BAD_REQUEST: 'Bad request',                                           // Error message for bad request
    UNPROCESSABLE_ENTITY: 'Unprocessable entity',                         // Error message for unprocessable entity
    WRONG_PAYMENT_METHOD: 'Wrong payment method. Use card or momo',       // Error message for wrong payment method
    INVALID_PHONE_NUMBER: 'Invalid phone number or unsupported phone network',  // Error message for invalid phone number
    DUPLICATE_TX_REF: 'Duplicate Transaction Reference (txRef)',  // Error message for duplicate transaction reference
};

// PaymentMethods: Supported payment methods in the application
export const PaymentMethods = {
    CARD: 'card',      // Payment method: Card
    MOMO: 'momo',      // Payment method: Mobile Money (MOMO)
};

// RequestStatus: Possible statuses for a request in the application
export const RequestStatus = {
    CANCELLED: 'CANCELLED',   // Request has been cancelled
    COMPLETED: 'COMPLETED',   // Request has been completed
    FAILED: 'FAILED',         // Request has failed
    PENDING: 'PENDING',       // Request is pending
    LOGGED: 'LOGGED',         // Request has been logged
    SUCCESSFUL: 'SUCCESS',    // Request has been successful
};

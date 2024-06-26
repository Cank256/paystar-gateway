const {
    ErrorMessages,
    PaymentMethods,
    StatusCodes
} = require('../utils/constants')
const { phone } = require('phone')
const Utils = require('../utils/utils')
const Transaction = require('../models/transactionsModel')

/**
 * Validation class provides methods for request validation.
 */
class Validation {
    /**
     * Validates the request body or parameters against the specified details.
     * @param req The Express Request object.
     * @param res The Express Response object.
     * @param details An array of strings specifying the details to validate.
     * @param position The position of the details to be validated ('body' or 'params'). Defaults to 'body'.
     */
    async request(req: Request, res: any, details: string[], position: string = 'body') {
        let errors: string[] = []
        let req_pos = position === 'body' ? req.body : (req as any).params
        let req_var = position === 'body' ? 'field' : 'parameter'

        for (const value of details) {
            if (req_pos.hasOwnProperty(value)) {
                if (req_pos[value] === '') {
                    errors.push(`The '${value}' ${req_var} must have a value.`)
                }

                if (value === 'method' && !this.validatePaymentMethod(req_pos[value])) {
                    errors.push(ErrorMessages.WRONG_PAYMENT_METHOD)
                }

                if (value === 'phone_number') {
                    const checkPhoneNumber = await this.validatePhoneNumber(req_pos[value])
                    if (!checkPhoneNumber) {
                        errors.push(ErrorMessages.INVALID_PHONE_NUMBER)
                    }
                }
            } else {
                errors.push(`Missing the '${value}' ${req_var}.`)
            }
        }

        if (errors.length > 0) {
            const result = await Utils.createResponse(
                StatusCodes.BAD_REQUEST,
                errors,
                `There are missing ${position} fields`
            )
            res.status(result.code).json(result);
        }

        if (position === 'body') {
            const checkDuplicate = await this.checkDuplicateTransaction(req_pos.txRef)
            if(!checkDuplicate){
                const result = await Utils.createResponse(
                    StatusCodes.BAD_REQUEST,
                    {
                        error: ErrorMessages.DUPLICATE_TX_REF
                    }
                )
                res.status(result.code).json(result);
            }
        }
    }

    /**
     * Validates the payment method.
     * @param method The payment method to validate.
     * @returns True if the payment method is valid, otherwise false.
     */
    validatePaymentMethod(method: string): boolean {
        return method === PaymentMethods.CARD || method === PaymentMethods.MOMO
    }

    /**
     * Validates the phone number.
     * @param phone_number The phone number to validate.
     * @returns A promise that resolves to true if the phone number is valid, otherwise false.
     */
    async validatePhoneNumber(phone_number: string): Promise<boolean> {
        try {
            const formatNumber = this.formatPhoneNumber(phone_number)
            
            if (!formatNumber) {
                return false
            }
            
            const parsedPhoneNumber = phone(formatNumber)

            if (!parsedPhoneNumber.isValid) {
                return false
            }

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    /**
     * Formats the phone number to a standard format.
     * @param phoneNumber The phone number to format.
     * @returns The formatted phone number or false if the phone number is invalid.
     */
    formatPhoneNumber(phoneNumber: string): string | false {
        const cleanedNumber = phoneNumber.replace(/\D/g, '')

        if (cleanedNumber.length === 10 && cleanedNumber.startsWith('0')) {
            return `+256${cleanedNumber.slice(1)}`
        } else if (cleanedNumber.length === 9 && /^[1-9]/.test(cleanedNumber)) {
            return `+256${cleanedNumber}`
        } else if (cleanedNumber.length === 12 && cleanedNumber.startsWith('256')) {
            return `+${cleanedNumber}`
        } else {
            return false
        }
    }

    /**
     * Checks if the transaction already exists.
     * @param txRef The transaction reference to check.
     * @returns True if the transaction exists, otherwise false.
     */
    async checkDuplicateTransaction(txRef: string): Promise<boolean> {
        const result = await Transaction.findOne({ txRef: txRef })

        return result !== null ? false : true
    }
}

module.exports = new Validation

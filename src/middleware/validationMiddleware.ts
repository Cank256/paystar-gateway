const {
    ErrorMessages,
    PaymentMethods,
} = require('../utils/constants')
const { phone } = require('phone')

class Validation {
    async request(req: Request, res: Response, details: string[], position: string = 'body') {
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
            return (res as any).status(400).json({
                success: false,
                message: 'Validation Error',
                errors: errors,
            })
        }        
    }

    validatePaymentMethod(method: string): boolean {
        return method === PaymentMethods.CARD || method === PaymentMethods.MOMO
    }

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
}

module.exports = new Validation

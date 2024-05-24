const {
    ErrorMessages,
    PaymentMethods,
} = require('../utils/constants')

class Validation {

    async request(req: any, res: any, details: any, position: string = 'body') {
        let errors: string[] = []
        let req_pos = position === 'body' ? req.body : req.params
        let req_var = position === 'body' ? 'field' : 'parameter'
        details.forEach((value: any) => {
            if (req_pos.hasOwnProperty(value)){
                if (req_pos[value] === ''){
                    errors.push(`The '${value}' ${req_var} must have a value.`)
                }

                if (value === 'method'){
                    if (!this.validatePaymentMethod(req_pos[value])){
                        errors.push(ErrorMessages.WRONG_PAYMENT_METHOD)
                    }
                }
            }
            else{
                errors.push(`Missing the '${value}' ${req_var}.`)
            }
        })

        if (errors.length > 0){
            return res.status(400).json({
                error: errors
            })
        }
    }

    validatePaymentMethod(method: string) {

        if (method !== PaymentMethods.CARD && method !== PaymentMethods.MOMO){
            return false
        }

        return true
    }
}

module.exports = new Validation

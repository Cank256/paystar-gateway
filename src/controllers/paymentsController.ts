const validate = require('./../middleware/validationMiddleware')
const payments = require('./../services/paymentsService')

class PaymentsController {
    async getAll(req: any, res: any) {
        res.status(200).json({
            'message': 'View all payments'
        })
    }

    async initiate(req: any, res: any) {
        const details = ['paymentRef', 'method', 'amount', 'currency', 'description']

        // Validate request
        await validate.request(req, res, details, 'body')

        const result = req.body.method == 'momo' ? 
            payments.initiateMobileMoneyPayment(req.body) :
            payments.initiateCardPayment(req.body)

        res.status(200).json(result)
    }

    async getOne(req: any, res: any) {
        const details = ['paymentRef']

        // Validate request
        await validate.request(req, res, details, 'params')

        res.status(200).json({
            'message': 'Get payment with id ' + req.params.paymentRef
        })
    }

    async refund(req: any, res: any) {
        const details = ['paymentRef']

        // Validate request
        await validate.request(req, res, details, 'params')

        res.status(200).json({
            'message': `Refund payment with id ${req.params.paymentRef}`
        })
    }
}

module.exports = new PaymentsController;

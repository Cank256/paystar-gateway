const validate = require('./../middleware/validationMiddleware')

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

        res.status(200).json({
            'message': 'Initiate payment transaction'
        })
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

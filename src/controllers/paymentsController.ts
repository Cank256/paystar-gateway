const validate = require('./../middleware/validationMiddleware')
const payments = require('./../services/paymentsService')

class PaymentsController {
    async getAll(req: any, res: any) {
        res.status(200).json({
            'message': 'View all payments'
        })
    }

    async initiate(req: any, res: any) {
        const details = ['paymentRef', 'method', 'amount', 'currency', 'email', 'phone_number', 'description']

        // Validate request
        await validate.request(req, res, details, 'body')

        const payDetails = req.body
        payDetails.gatewayRef = req.gatewayRef
        payDetails.client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const result = req.body.method == 'momo' ? 
            await payments.initiateMobileMoneyPayment(payDetails) :
            await payments.initiateCardPayment(payDetails)

        res.status(result.code).json(result)
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

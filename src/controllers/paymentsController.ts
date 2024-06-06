const validate = require('./../middleware/validationMiddleware')
const payments = require('./../services/paymentsService')

/**
 * PaymentsController handles HTTP requests related to payments.
 */
class PaymentsController {

    /**
     * Initiate a new payment.
     * @name Initiate Payment
     * @route {POST} /payments
     * @handler PaymentsController.initiate
     */
    async initiate(req: any, res: any) {
        const details = ['txRef', 'method', 'amount', 'currency', 'email', 'phone_number', 'description']

        // Validate request
        await validate.request(req, res, details, 'body')

        const payDetails = req.body
        payDetails.gatewayRef = req.gatewayRef
        payDetails.client_ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        payDetails.url = req.originalUrl

        const result = req.body.method == 'momo' ? 
            await payments.initiateMobileMoneyPayment(payDetails) :
            await payments.initiateCardPayment(payDetails)

        res.status(result.code).json(result)
    }
}

module.exports = new PaymentsController;

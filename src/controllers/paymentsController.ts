const validate = require('./../middleware/validationMiddleware')
const payments = require('./../services/paymentsService')

/**
 * PaymentsController handles HTTP requests related to payments.
 */
class PaymentsController {
    /**
     * Get all payments.
     * @name Get All Payments
     * @route {GET} /payments
     * @handler PaymentsController.getAll
     */
    async getAll(req: any, res: any) {
        const result = await payments.getAllTransactions(req.gatewayRef)

        res.status(result.code).json(result)
    }

    /**
     * Initiate a new payment.
     * @name Initiate Payment
     * @route {POST} /payments
     * @handler PaymentsController.initiate
     */
    async initiate(req: any, res: any) {
        const details = ['paymentRef', 'method', 'amount', 'currency', 'email', 'phone_number', 'description']

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

    /**
     * Get a specific payment by its reference.
     * @name Get Payment by Reference
     * @route {GET} /payments/:paymentRef
     * @param {string} paymentRef The reference ID of the payment.
     * @handler PaymentsController.getOne
     */
    async getOne(req: any, res: any) {
        const details = ['paymentRef']

        // Validate request
        await validate.request(req, res, details, 'params')

        const transDetails = req.params
        transDetails.gatewayRef = req.gatewayRef

        const result = await payments.getOneTransaction(transDetails)

        res.status(result.code).json(result)
    }

    /**
     * Refund a payment.
     * @name Refund Payment
     * @route {POST} /payments/:paymentRef/refund
     * @param {string} paymentRef The reference ID of the payment to be refunded.
     * @handler PaymentsController.refund
     */
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

const validate = require('./../middleware/validationMiddleware')
const transfers= require('./../services/transfersService')

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
    async initiateTransfer(req: any, res: any) {
        const details = ['paymentRef', 'method', 'amount', 'currency', 'email', 'phone_number', 'description']

        // Validate request
        await validate.request(req, res, details, 'body')

        const transferDetails = req.body
        transferDetails.gatewayRef = req.gatewayRef
        transferDetails.client_ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        transferDetails.url = req.originalUrl

        const result = await transfers.initiateTransfer(transferDetails)

        res.status(result.code).json(result)
    }
}

module.exports = new PaymentsController;

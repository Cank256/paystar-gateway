const validate = require('./../middleware/validationMiddleware')
const transactions = require('./../services/transactionsService')

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
        const result = await transactions.getAllTransactions(req.gatewayRef)

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

        const result = await transactions.getOneTransaction(transDetails)

        res.status(result.code).json(result)
    }
}

module.exports = new PaymentsController;

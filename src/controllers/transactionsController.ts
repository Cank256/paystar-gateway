const validate = require('./../middleware/validationMiddleware')
const transactions = require('./../services/transactionsService')

/**
 * TransactionsController handles HTTP requests related to transactions.
 */
class TransactionsController {
    /**
     * Get all transactions.
     * @name Get All Transactions
     * @route {GET} /transactions
     * @handler TransactionsController.getAll
     */
    async getAll(req: any, res: any) {
        const result = await transactions.getAllTransactions(req.gatewayRef)

        res.status(result.code).json(result)
    }

    /**
     * Get a specific transaction by its reference.
     * @name Get Transaction by Reference
     * @route {GET} /transactions/:txRef
     * @param {string} txRef The reference ID of the transaction.
     * @handler TransactionsController.getOne
     */
    async getOne(req: any, res: any) {
        const details = ['txRef']

        // Validate request
        await validate.request(req, res, details, 'params')

        const transDetails = req.params
        transDetails.gatewayRef = req.gatewayRef

        const result = await transactions.getOneTransaction(transDetails)

        res.status(result.code).json(result)
    }

    /**
     * Refund a transaction.
     * @name Refund Transaction
     * @route {POST} /transactions/:txRef/refund
     * @param {string} txRef The reference ID of the transaction to be refunded.
     * @handler TransactionsController.refund
     */
    async refund(req: any, res: any) {
        const details = ['txRef']

        // Validate request
        await validate.request(req, res, details, 'params')

        const transDetails = req.params
        transDetails.gatewayRef = req.gatewayRef

        const result = await transactions.initiateRefund(transDetails)

        res.status(result.code).json(result)
    }
}

module.exports = new TransactionsController;

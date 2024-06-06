const transactionRoutes = require('express').Router()
const transactionsController = require('../controllers/transactionsController')

/**
 * GET /transactions
 * Get all transactions.
 * @name Get All transactions
 * @route {GET} /transactions
 * @handler transactionsController.getAll
 */
transactionRoutes.get('/', transactionsController.getAll);

/**
 * GET /transactions/:transactionRef
 * Get a specific transaction by its reference.
 * @name Get transaction by Reference
 * @route {GET} /transactions/:transactionRef
 * @param {string} transactionRef The reference ID of the transaction.
 * @handler transactionsController.getOne
 */
transactionRoutes.get('/:txRef', transactionsController.getOne);

/**
 * POST /transactions/:txRef/refund
 * Refund a payment.
 * @name Refund Transaction
 * @route {POST} /transactions/:txRef/refund
 * @param {string} txRef The reference ID of the payment to be refunded.
 * @handler transactionsController.refund
 */
transactionRoutes.post('/:txRef/refund', transactionsController.refund);

// Export the router instance
module.exports = transactionRoutes;

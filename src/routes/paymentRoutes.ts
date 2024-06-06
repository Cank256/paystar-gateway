const paymentRoutes = require('express').Router()
const paymentsController = require('../controllers/paymentsController')
const transactionRoutes= require('./transactionRoutes')

/**
 * POST /payments
 * Initiate a new payment.
 * @name Initiate Payment
 * @route {POST} /payments
 * @handler paymentsController.initiate
 */
paymentRoutes.post('/', paymentsController.initiate);

/**
 * POST /payments/:paymentRef/refund
 * Refund a payment.
 * @name Refund Payment
 * @route {POST} /payments/:paymentRef/refund
 * @param {string} paymentRef The reference ID of the payment to be refunded.
 * @handler paymentsController.refund
 */
paymentRoutes.post('/:paymentRef/refund', paymentsController.refund);

paymentRoutes.use(transactionRoutes)

// Export the router instance
module.exports = paymentRoutes;

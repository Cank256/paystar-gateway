const paymentRoutes = require('express').Router()
const paymentsController = require('../controllers/paymentsController')

/**
 * GET /payments
 * Get all payments.
 * @name Get All Payments
 * @route {GET} /payments
 * @handler paymentsController.getAll
 */
paymentRoutes.get('/', paymentsController.getAll);

/**
 * POST /payments
 * Initiate a new payment.
 * @name Initiate Payment
 * @route {POST} /payments
 * @handler paymentsController.initiate
 */
paymentRoutes.post('/', paymentsController.initiate);

/**
 * GET /payments/:paymentRef
 * Get a specific payment by its reference.
 * @name Get Payment by Reference
 * @route {GET} /payments/:paymentRef
 * @param {string} paymentRef The reference ID of the payment.
 * @handler paymentsController.getOne
 */
paymentRoutes.get('/:paymentRef', paymentsController.getOne);

/**
 * POST /payments/:paymentRef/refund
 * Refund a payment.
 * @name Refund Payment
 * @route {POST} /payments/:paymentRef/refund
 * @param {string} paymentRef The reference ID of the payment to be refunded.
 * @handler paymentsController.refund
 */
paymentRoutes.post('/:paymentRef/refund', paymentsController.refund);

// Export the router instance
module.exports = paymentRoutes;

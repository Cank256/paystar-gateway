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

// Export the router instance
module.exports = paymentRoutes;

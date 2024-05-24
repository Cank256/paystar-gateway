const paymentRoutes = require('express').Router()
const paymentsController = require('../controllers/paymentsController')

paymentRoutes.get('/', paymentsController.getAll)

paymentRoutes.post('/', paymentsController.initiate)

paymentRoutes.get('/:paymentId', paymentsController.getOne)

paymentRoutes.post('/:paymentId/refund', paymentsController.refund)

module.exports = paymentRoutes

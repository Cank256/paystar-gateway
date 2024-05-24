const paymentRoutes = require('express').Router()
const paymentsController = require('../controllers/paymentsController')

paymentRoutes.get('/', paymentsController.getAll)

paymentRoutes.post('/', paymentsController.initiate)

paymentRoutes.get('/:paymentRef', paymentsController.getOne) 

paymentRoutes.post('/:paymentRef/refund', paymentsController.refund)

module.exports = paymentRoutes

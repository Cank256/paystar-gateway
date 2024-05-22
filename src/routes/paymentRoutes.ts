const paymentRoutes = require('express').Router()

paymentRoutes.get('/', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: 'Get All Payment Transactions'
    })
})

paymentRoutes.post('/', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: 'Initiate a Payment Transaction'
    })
})

paymentRoutes.get('/:paymentId', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: `Get a Payment Transaction using paymentId ${req.params.paymentId}`
    })
})

paymentRoutes.post('/:paymentId/refund', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: 'initiate Payment Refund'
    })
})

module.exports = paymentRoutes

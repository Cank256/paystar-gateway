const routes = require('express').Router()
const paymentRoutes = require('./paymentRoutes')

routes.get('/', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Paystar Gateway API'
    })
})

routes.use('/payments', paymentRoutes)

module.exports = routes

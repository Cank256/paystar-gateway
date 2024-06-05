const routes = require('express').Router()

/**
 * GET /
 * Welcome route.
 * @name Welcome Route
 * @route {GET} /
 */
routes.get('/', (req: any, res: any) => {
    /**
     * Responds with a welcome message.
     * @name Welcome Message
     * @response {Object} Response object
     * @response {boolean} success Indicates if the request was successful.
     * @response {string} message Welcome message.
     */
    res.status(200).json({
        success: true,
        message: 'Welcome to Paystar Gateway API'
    })
})

// Mount paymentRoutes under /payments path
routes.use('/payments', require('./paymentRoutes'))

module.exports = routes

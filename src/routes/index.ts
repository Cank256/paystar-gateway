const routes = require('express').Router()

routes.get('/', (req: any, res: any) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Paystar Gateway API'
    })
})

module.exports = routes

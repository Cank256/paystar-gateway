const webhookRouter = require('express').Router();
const webhooksController = require('../controllers/webhooksController')

// Webhook route
webhookRouter.post('/flutterwave', webhooksController.handleWebhook);

module.exports = webhookRouter;

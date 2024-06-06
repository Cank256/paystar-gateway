const transferRoutes = require('express').Router()
const transfersController = require('../controllers/transfersController')

/**
 * POST /transfers/transfer
 * Initiate a new transfer.
 * @name Initiate Transfer
 * @route {POST} /transfers
 * @handler transfersController.initiate
 */
transferRoutes.post('/', transfersController.initiateTransfer);

// Export the router instance
module.exports = transferRoutes;

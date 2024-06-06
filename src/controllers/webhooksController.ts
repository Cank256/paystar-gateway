const crypto = require('crypto');
const { StatusCodes } = require('../utils/constants');
const webhookService = require('../services/webhooksService');
const Utils = require('../utils/utils');

/**
 * Handles incoming webhooks from Flutterwave.
 * Verifies the webhook signature and processes the event.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.handleWebhook = async (req: any, res: any) => {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH; // Replace with your Flutterwave secret hash

    // Compute the hash from the request body
    const hash = crypto.createHmac('sha256', secretHash)
        .update(JSON.stringify(req.body))
        .digest('hex');

    // Validate the computed hash against the hash sent in the headers
    if (hash !== req.headers['verif-hash']) {
        // Respond with an unauthorized status if the hash is invalid
        return res.status(StatusCodes.UNAUTHORIZED).json(
            Utils.createResponse(StatusCodes.UNAUTHORIZED, {}, 'Invalid hash')
        );
    }

    const event = req.body;

    try {
        // Process the event using the webhook service
        await webhookService.processEvent(event);

        // Respond with an OK status
        return res.status(StatusCodes.OK).json(
            Utils.createResponse(StatusCodes.OK, {})
        );
    } catch (err) {
        // Log the error and respond with an internal server error status
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, {}, 'Internal server error')
        );
    }
};

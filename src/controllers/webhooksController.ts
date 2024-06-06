const crypto = require('crypto');
const { StatusCodes } = require('../utils/constants');
const webhookService = require('../services/webhooksService');
const Utils = require('../utils/utils')

exports.handleWebhook = async (req: any, res: any) => {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH; // Replace with your Flutterwave secret hash

    const hash = crypto.createHmac('sha256', secretHash)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['verif-hash']) {
        await Utils.createResponse(
            StatusCodes.UNAUTHORIZED,
            {},
            'Invalid hash'
        )
    }

    const event = req.body;

    try {
        await webhookService.processEvent(event);
        await Utils.createResponse(
            StatusCodes.OK,
            {}
        )
    } catch (err) {
        Utils.createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {}
        )
    }
};

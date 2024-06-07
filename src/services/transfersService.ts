const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
const Utils = require('../utils/utils')
const { StatusCodes, RequestStatus } = require('../utils/constants')

/**
 * PaymentsService handles payment-related operations.
 */
class TransfersService {

    /**
     * Initiates a mobile money transfer using the Flutterwave API.
     *
     * @param {Object} transferDetails - The details of the transfer.
     * @returns {Promise<Object>} - The response object containing the transfer result.
     */
    async initiate(transferDetails: any) {
        try {
            const payload = {
                account_bank: 'MPS', // Bank code for Mobile Money
                account_number: transferDetails.phone_number,
                amount: transferDetails.amount,
                narration: transferDetails.description,
                currency: transferDetails.currency,
                beneficiary_name: transferDetails.meta.client_name,
                reference: transferDetails.gatewayRef, // Unique reference for this transfer
                callback_url: transferDetails.callback_url // URL to be called after transfer
            };

            // Initiate the transfer
            const response = await flw.Transfer.initiate(payload);

            // Check the response from Flutterwave
            if (response.status === 'success') {
                let data = {
                    status: RequestStatus.PENDING,
                    transfer_id: response.data.id,
                    reference: transferDetails.reference,
                    gateway_ref: transferDetails.gatewayRef,
                    transaction_ref: transferDetails.txRef
                };

                // Log the transfer transaction
                await Utils.insertTransactionLog(transferDetails, response.message, response.data);

                return Utils.createResponse(StatusCodes.OK, data);
            } else {
                // Handle the case where the transfer was not successful
                response.reference = transferDetails.reference;
                response.gateway_ref = transferDetails.gatewayRef
                response.transaction_ref = transferDetails.txRef

                // Log the failed transaction
                await Utils.insertTransactionLog(transferDetails, response.message, response.data);

                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response);
            }
        } catch (err: any) {

            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    gateway_ref: transferDetails.gatewayRef,
                    transaction_ref: transferDetails.reference,
                },
                err.message
            );
        }
    }
}

module.exports = new TransfersService;

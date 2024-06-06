const Transaction = require('../models/transactionsModel');
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(Bun.env.FLUTTERWAVE_PUBLIC_KEY, Bun.env.FLUTTERWAVE_SECRET_KEY);
const Utils = require('../utils/utils')
const { StatusCodes, RequestStatus } = require('../utils/constants')

/**
 * PaymentsService handles payment-related operations.
 */
class TransactionsService {
    /**
     * Retrieves a single transaction by paymentRef.
     * 
     * @param {Object} details - An object containing the details needed to find the transaction.
     * @param {string} details.paymentRef - The payment reference to search for.
     * @returns {Promise<Object>} - A promise that resolves to a response object containing the transaction or an error message.
     */
    async getOneTransaction(details: any) {
        try {
            const result = await Transaction.findOne({ paymentRef: details.paymentRef });

            if (result) {
                return Utils.createResponse(StatusCodes.OK, result);
            } else {
                return Utils.createResponse(
                    StatusCodes.NOT_FOUND,
                    {
                        message: `No transaction found with paymentRef ${details.paymentRef}`
                    }
                );
            }
        } catch (err: any) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err.message,
                    gateway_ref: details.gatewayRef,
                    py_ref: details.paymentRef,
                }
            );
        }
    }

    /**
     * Retrieves all transactions.
     * 
     * @param {string} gateway_ref - The gateway reference to include in the error response if necessary.
     * @returns {Promise<Object>} - A promise that resolves to a response object containing all transactions or an error message.
     */
    async getAllTransactions(gateway_ref: any) {
        try {
            const result = await Transaction.find();

            if (result) {
                return Utils.createResponse(StatusCodes.OK, result);
            } else {
                return Utils.createResponse(
                    StatusCodes.NOT_FOUND,
                    {
                        message: 'No transactions found.'
                    }
                );
            }
        } catch (err: any) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err.message,
                    gateway_ref: gateway_ref
                }
            );
        }
    }

    async refundTransaction(details: any){
        try {
            // Assuming paymentRef is the unique transaction reference used with Flutterwave
            const paymentRef = details.paymentRef;

            // Fetch the transaction from your database (optional)
            const transaction = await this.getOneTransaction({ paymentRef });
            if (transaction.code !== StatusCodes.OK) {
                return Utils.createResponse(
                    StatusCodes.BAD_REQUEST,
                    {
                        error: `Error occured while retriving transaction with paymentRef: ${paymentRef}`,
                        gateway_ref: details.gatewayRef
                    }
                );
            }
            
            // Prepare the payload for the refund request
            const payload = {
                id: transaction.data.responseBody.data.flw_ref, // Flutterwave transaction ID
                amount: transaction.data.requestBody.amount
            };

            // Initiate the refund
            const response = await flw.Transaction.refund(payload);
            console.log(response)

            // Check the response from Flutterwave
            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {

                return Utils.createResponse(StatusCodes.OK, response);

            } else {
                return Utils.createResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    {
                        error: response.message,
                        gateway_ref: details.gatewayRef,
                        payment_ref: details.paymentRef
                    },
                    `Refund failed for paymentRef ${paymentRef}`
                );
            }
        } catch (err: any) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err.message,
                    gateway_ref: details.gatewayRef,
                    payment_ref: details.paymentRef
                },
                'Refund encountered an error'
            );
        }
    }

    async initiateRefund(details: any){
        try {
            // Assuming paymentRef is the unique transaction reference used with Flutterwave
            const paymentRef = details.paymentRef;

            // Fetch the transaction from your database (optional)
            const transaction = await this.getOneTransaction({ paymentRef });
            if (transaction.code !== StatusCodes.OK) {
                return Utils.createResponse(
                    StatusCodes.BAD_REQUEST,
                    {
                        error: `Error occured while retriving transaction with paymentRef: ${paymentRef}`,
                        gateway_ref: details.gatewayRef
                    }
                );
            }
            
            // Prepare the payload for the refund request
            const payload = {
                id: transaction.data.responseBody.data.flw_ref, // Flutterwave transaction ID
                amount: transaction.data.requestBody.amount
            };

            // Initiate the refund
            const response = await flw.Transaction.refund(payload);
            console.log(response)

            // Check the response from Flutterwave
            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {

                return Utils.createResponse(StatusCodes.OK, response);

            } else {
                return Utils.createResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    {
                        error: response.message,
                        gateway_ref: details.gatewayRef,
                        payment_ref: details.paymentRef
                    },
                    `Refund failed for paymentRef ${paymentRef}`
                );
            }
        } catch (err: any) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err.message,
                    gateway_ref: details.gatewayRef,
                    payment_ref: details.paymentRef
                },
                'Refund encountered an error'
            );
        }
    }
}

module.exports = new TransactionsService;

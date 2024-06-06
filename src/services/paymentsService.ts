const Transaction = require('../models/transactionsModel');
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(Bun.env.FLUTTERWAVE_PUBLIC_KEY, Bun.env.FLUTTERWAVE_SECRET_KEY);
const Utils = require('../utils/utils')
const { StatusCodes, RequestStatus } = require('../utils/constants')

/**
 * PaymentsService handles payment-related operations.
 */
class PaymentsService {

    /**
     * Initiates a mobile money payment.
     * @param payDetails Details of the payment to be initiated.
     * @returns A promise that resolves to a response object indicating the status
     * of the payment initiation.
     */
    async initiateMobileMoneyPayment(payDetails: any) {

        try {
            const payload = {
                'tx_ref':payDetails.gatewayRef,
                'amount':payDetails.amount,
                'currency':payDetails.currency,
                'network':'MTN',
                'email':payDetails.email,
                'phone_number':payDetails.phone_number,
                'callback_url': payDetails.callback_url
            }

            const response =  await flw.MobileMoney.uganda(payload)

            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {
                let data = {
                    status: RequestStatus.PENDING,
                    url: response.meta.authorization.redirect,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                }

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                /*add the transaction IDs to the response*/
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.paymentRef

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response)
            }
        }
        catch(err){
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                },
            )
        }
    }

    /**
     * Initiates a card payment.
     * @param payDetails Details of the payment to be initiated.
     * @returns A promise that resolves to a response object indicating the status of
     * the payment initiation.
     */
    async initiateCardPayment(payDetails: any) {
        try {
            const payload = {
                'card_number': '5531886652142950',
                'cvv': '564',
                'expiry_month': '09',
                'expiry_year': '27',
                'currency': payDetails.currency,
                'amount': payDetails.amount,
                'redirect_url': payDetails.meta.redirect,
                'fullname': payDetails.meta.client_name,
                'email': payDetails.email,
                'phone_number': payDetails.phone_number,
                'enckey': process.env.FLUTTERWAVE_ENCRYPTION_KEY,
                'tx_ref': payDetails.gatewayRef,
                'authorization': {}
            }

            const response = await flw.Charge.card(payload)

            // For PIN transactions
            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    'mode': 'pin',
                    'fields': [
                        'pin'
                    ],
                    'pin': 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)
    
                // Add the OTP to authorize the transaction
                const callValidate = await flw.Charge.validate({
                    'otp': '12345',
                    'flw_ref': reCallCharge.data.flw_ref
                })
                console.log(callValidate)
    
            }
    
            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {
                let data = {
                    status: RequestStatus.PENDING,
                    url: response.meta.authorization.redirect,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                }

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                /*add the transaction IDs to the response*/
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.paymentRef

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response)
            }
        } catch (err) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                }
            )
        }
    }

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

    /**
     * Initiates a transfer using the Flutterwave API.
     *
     * @param {Object} transferDetails - The details of the transfer.
     * @returns {Promise<Object>} - The response object containing the transfer result.
     */
    async initiateTransfer(transferDetails: any) {
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
                };

                // Log the transfer transaction
                await Utils.insertTransactionLog(transferDetails, response.message, response.data);

                return Utils.createResponse(StatusCodes.OK, data);
            } else {
                // Handle the case where the transfer was not successful
                response.reference = transferDetails.reference;

                // Log the failed transaction
                await Utils.insertTransactionLog(transferDetails, response.message, response.data);

                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response);
            }
        } catch (err: any) {

            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    reference: transferDetails.reference,
                },
                err.message
            );
        }
    }
}

module.exports = new PaymentsService;

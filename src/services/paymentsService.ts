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
     * @returns A promise that resolves to a response object indicating the status of the payment initiation.
     */
    async initiateMobileMoneyPayment(payDetails: any) {
        try {
            // Prepare payload for initiating mobile money payment
            const payload = {
                'tx_ref': payDetails.gatewayRef,
                'amount': payDetails.amount,
                'currency': payDetails.currency,
                'network': 'MTN',
                'email': payDetails.email,
                'phone_number': payDetails.phone_number,
            }

            // Initiate mobile money payment
            const response = await flw.MobileMoney.uganda(payload)

            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {
                // Payment initiation successful, prepare response data
                let data = {
                    status: RequestStatus.PENDING,
                    url: response.meta.authorization.redirect,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                }

                // Log transaction and return success response
                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                // Payment initiation failed, log transaction and return error response
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.paymentRef
                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response)
            }
        }
        catch (err) {
            // Error occurred, log transaction and return error response
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                },
                err,
            )
        }
    }

    /**
     * Initiates a card payment.
     * @param payDetails Details of the payment to be initiated.
     * @returns A promise that resolves to a response object indicating the status of the payment initiation.
     */
    async initiateCardPayment(payDetails: any) {
        try {
            // Prepare payload for initiating card payment
            const payload = {
                // Payment details...
            }

            // Initiate card payment
            const response = await flw.Charge.card(payload)

            // For PIN transactions...
            if (response.meta.authorization.mode === 'pin') {
                // Handle PIN transactions...
            }

            if (response.status.toUpperCase() == RequestStatus.SUCCESSFUL) {
                // Payment initiation successful, prepare response data
                let data = {
                    // Response data...
                }

                // Log transaction and return success response
                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                // Payment initiation failed, log transaction and return error response
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.paymentRef
                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response)
            }
        } catch (err) {
            // Error occurred, log transaction and return error response
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                },
                err,
            )
        }
    }
}

module.exports = new PaymentsService;

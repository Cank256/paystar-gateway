const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(Bun.env.FLUTTERWAVE_PUBLIC_KEY, Bun.env.FLUTTERWAVE_SECRET_KEY);
const Utils = require('../utils/utils')
const { StatusCodes, RequestStatus } = require('../utils/constants')
const TransactionsService = require('./transactionsService')

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
                    py_ref: payDetails.txRef,
                }

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                /*add the transaction IDs to the response*/
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.txRef

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
                    py_ref: payDetails.txRef,
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
                    py_ref: payDetails.txRef,
                }

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                /*add the transaction IDs to the response*/
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.txRef

                await Utils.insertTransactionLog(payDetails, response.message, response)
                return Utils.createResponse(StatusCodes.INTERNAL_SERVER_ERROR, response)
            }
        } catch (err) {
            return Utils.createResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                {
                    error: err,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.txRef,
                }
            )
        }
    }
}

module.exports = new PaymentsService;

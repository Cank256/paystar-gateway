const { ErrorMessages } = require('../utils/constants')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(Bun.env.FLUTTERWAVE_PUBLIC_KEY, Bun.env.FLUTTERWAVE_SECRET_KEY);
const Utils = require('../utils/utils')
const { StatusCodes, RequestStatus } = require('../utils/constants')

class PaymentsService {

    async initiateMobileMoneyPayment(payDetails: any) {

        try {
            const reqDetails = {
                'tx_ref':payDetails.gatewayRef,
                'amount':payDetails.amount,
                'currency':payDetails.currency,
                'network':'MTN',
                'email':payDetails.email,
                'phone_number':payDetails.phone_number,
                'client_ip':payDetails.client_ip,
            }

            const response =  await flw.MobileMoney.uganda(reqDetails)

            if (response.status.toUpperCase() == RequestStatus.SUCCESSFULL) {
                let data = {
                    status: RequestStatus.PENDING,
                    url: response.meta.authorization.redirect,
                    gateway_ref: payDetails.gatewayRef,
                    py_ref: payDetails.paymentRef,
                }
                return Utils.createResponse(StatusCodes.OK, data)
            } else {
                /*add the transaction IDs to the response*/
                response.gateway_ref = payDetails.gatewayRef
                response.py_ref = payDetails.paymentRef
                return Utils.createResponse(StatusCodes.BAD_REQUEST, response)
            }
        }
        catch(err){
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

    async initiateCardPayment(req: any) {
        return {
            message: 'Card Payment Initiated'
        }
    }
}

module.exports = new PaymentsService;

const { ErrorMessages } = require('../utils/constants')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(Bun.env.FLUTTERWAVE_PUBLIC_KEY, Bun.env.FLUTTERWAVE_SECRET_KEY);

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
            return response
        }
        catch(err){
            return {
                'success': false,
                'message': ErrorMessages.INTERNAL_SERVER_ERROR,
                'error': err
            }
        }
    }

    async initiateCardPayment(req: any) {
        return {
            message: 'Card Payment Initiated'
        }
    }
}

module.exports = new PaymentsService;

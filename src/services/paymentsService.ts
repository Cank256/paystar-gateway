
class PaymentsService {
    serviceUrl: any
    secretKey: any

    constructor() {
        this.serviceUrl = Bun.env.FLUTTERWAVE_API_URL
        this.secretKey = Bun.env.FLUTTERWAVE_SECRET_KEY
    }

    async initiateMobileMoneyPayment(req: any) {


        return {
            message: 'Momo Payment Initiated'
        }
    }

    async initiateCardPayment(req: any) {
        return {
            message: 'Card Payment Initiated'
        }
    }
}

module.exports = new PaymentsService;

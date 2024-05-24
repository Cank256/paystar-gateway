
class PaymentsService {
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

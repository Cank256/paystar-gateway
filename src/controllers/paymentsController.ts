class PaymentsController {
    async getAll(req: any, res: any) {
        res.status(200).json({
            'message': 'View all payments'
        })
    }

    async initiate(req: any, res: any) {
        res.status(200).json({
            'message': 'Initiate payment transaction'
        })
    }

    async getOne(req: any, res: any) {
        res.status(200).json({
            'message': 'Get payment with id ' + req.params.paymentId
        })
    }

    async refund(req: any, res: any) {
        res.status(200).json({
            'message': 'Refund payment'
        })
    }
}

module.exports = new PaymentsController;

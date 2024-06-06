const Utils = require('../utils/utils');
const Transaction = require('../models/transactionsModel');
const { StatusCodes, RequestStatus } = require('../utils/constants');

exports.processEvent = async (event: any) => {
    switch (event.event) {
        case 'charge.completed':
            await handleChargeCompleted(event);
            break;
        case 'refund.completed':
            await handleRefundCompleted(event);
            break;
        case 'transfer.completed':
            await handleTransferCompleted(event);
            break;
        default:
            console.log(`Unhandled event type: ${event.event}`);
    }
};

const handleChargeCompleted = async (event: any) => {
    const data = event.data;

    const update = {
        status: RequestStatus.COMPLETED,
        updatedAt: new Date(),
        responseBody: data,
    };

    await Transaction.findOneAndUpdate({ paymentRef: data.tx_ref }, update);

    await Utils.insertTransactionLog(
        { gatewayRef: data.tx_ref, paymentRef: data.tx_ref },
        'Charge completed',
        data
    );
};

const handleRefundCompleted = async (event: any) => {
    const data = event.data;

    const update = {
        status: RequestStatus.REFUNDED,
        updatedAt: new Date(),
        responseBody: data,
    };

    await Transaction.findOneAndUpdate({ paymentRef: data.tx_ref }, update);

    await Utils.insertTransactionLog(
        { gatewayRef: data.tx_ref, paymentRef: data.tx_ref },
        'Refund completed',
        data
    );
};

const handleTransferCompleted = async (event: any) => {
    const data = event.data;

    const update = {
        status: RequestStatus.COMPLETED,
        updatedAt: new Date(),
        responseBody: data,
    };

    await Transaction.findOneAndUpdate({ paymentRef: data.reference }, update);

    await Utils.insertTransactionLog(
        { gatewayRef: data.reference, paymentRef: data.reference },
        'Transfer completed',
        data
    );
};

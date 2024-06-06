const Utils = require('../utils/utils');
const Transaction = require('../models/transactionsModel');
const { RequestStatus } = require('../utils/constants');

/**
 * Processes incoming webhook events from Flutterwave.
 * @param {Object} event - The event payload received from Flutterwave.
 */
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

/**
 * Handles the 'charge.completed' event.
 * Updates the transaction status to 'COMPLETED' and logs the transaction.
 * @param {Object} event - The event payload for 'charge.completed'.
 */
const handleChargeCompleted = async (event: any) => {
    const data = event.data;

    // Update the transaction status to 'COMPLETED'
    const update = {
        status: RequestStatus.COMPLETED,
        updatedAt: new Date(),
        responseBody: data,
    };

    // Find the transaction by payment reference and update it
    await Transaction.findOneAndUpdate({ paymentRef: data.tx_ref }, update);

    // Log the transaction
    await Utils.insertTransactionLog(
        { gatewayRef: data.tx_ref, paymentRef: data.tx_ref },
        'Charge completed',
        data
    );
};

/**
 * Handles the 'refund.completed' event.
 * Updates the transaction status to 'REFUNDED' and logs the transaction.
 * @param {Object} event - The event payload for 'refund.completed'.
 */
const handleRefundCompleted = async (event: any) => {
    const data = event.data;

    // Update the transaction status to 'REFUNDED'
    const update = {
        status: RequestStatus.REFUNDED,
        updatedAt: new Date(),
        responseBody: data,
    };

    // Find the transaction by payment reference and update it
    await Transaction.findOneAndUpdate({ paymentRef: data.tx_ref }, update);

    // Log the transaction
    await Utils.insertTransactionLog(
        { gatewayRef: data.tx_ref, paymentRef: data.tx_ref },
        'Refund completed',
        data
    );
};

/**
 * Handles the 'transfer.completed' event.
 * Updates the transaction status to 'COMPLETED' and logs the transaction.
 * @param {Object} event - The event payload for 'transfer.completed'.
 */
const handleTransferCompleted = async (event: any) => {
    const data = event.data;

    // Update the transaction status to 'COMPLETED'
    const update = {
        status: RequestStatus.COMPLETED,
        updatedAt: new Date(),
        responseBody: data,
    };

    // Find the transaction by payment reference and update it
    await Transaction.findOneAndUpdate({ paymentRef: data.reference }, update);

    // Log the transaction
    await Utils.insertTransactionLog(
        { gatewayRef: data.reference, paymentRef: data.reference },
        'Transfer completed',
        data
    );
};

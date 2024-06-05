const mongoose = require('mongoose');

// Define the schema
const transactionSchema = new mongoose.Schema({
    gatewayRef: {
        type: String,
        required: true
    },
    paymentRef: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    message: {
        type: String,
        required: true,
    },
    requestUrl: {
        type: String,
        required: true,
    },
    requestIP: {
        type: String,
        required: true,
    },
    requestBody: {
        type: Object,
        required: true
    },
    responseBody: {
        type: Object,
        required: false
    },
    createdAt: {
        type: Date,
        required: false,
        default: () => new Date()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: () => new Date()
    }
});

// Create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

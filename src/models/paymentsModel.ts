const mongoose = require('mongoose');

// Define the schema
const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true
    },
    transactionRef: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    currency: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
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
})

// Create the model
const Payment = mongoose.model('Transaction', paymentSchema)

module.exports = new Payment

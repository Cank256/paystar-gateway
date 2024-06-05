import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a transaction document.
 */
interface ITransaction extends Document {
    gatewayRef: string;
    paymentRef: string;
    status: string;
    message: string;
    requestUrl: string;
    requestIP: string;
    requestBody: any;
    responseBody?: any;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema
const transactionSchema: Schema = new Schema({
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
const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;

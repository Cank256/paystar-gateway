const { StatusCodes, RequestStatus } = require('./constants')
const Transaction = require('../models/transactionsModel');

/**
 * Interface representing a standardized API response.
 * @interface
 * @name IResponse
 * @property {number} code - HTTP status code of the response.
 * @property {boolean} success - Indicates the success status of the request.
 * @property {string} message - Descriptive message associated with the response.
 * @property {any} [data] - Optional data payload included in the response.
 */
interface IResponse {
    code: number
    success: boolean
    message: string
    data?: any
}

/**
 * Utils class provides utility functions for creating responses, getting status code messages,
 * and inserting transaction logs.
 */

class Utils {

    /**
     * Creates a response object with the specified code, data, and optional extra information.
     * @param code The HTTP status code for the response.
     * @param data The data to include in the response.
     * @param extraInfo Additional information to append to the response message.
     * @returns The response object containing code, success status, message, and data.
     */
    createResponse(code: any, data: any, extraInfo: string = ''):IResponse{
        return {
            code,
            success: code < 300,
            message: this.getStatusCodeMessage(code, extraInfo),
            data
        }
    }

    /**
     * Retrieves the message associated with the provided HTTP status code.
     * @param code The HTTP status code.
     * @param extraInfo Additional information to append to the status message.
     * @returns The status message corresponding to the provided status code.
     */
    getStatusCodeMessage(code: number, extraInfo: string): string {
        switch (code) {
            case StatusCodes.OK:
                return `Request completed successfully. ${extraInfo}`.trim()
            case StatusCodes.SERVICE_UNAVAILABLE:
                return `Service is unavailable. ${extraInfo}`.trim()
            case StatusCodes.BAD_REQUEST:
                return `Invalid request. ${extraInfo}`.trim()
            case StatusCodes.HTTP_GATEWAY_TIMEOUT:
            case StatusCodes.INTERNAL_SERVER_ERROR:
                return `Encountered an unexpected condition. ${extraInfo}`.trim()
            case StatusCodes.UNPROCESSABLE_ENTITY:
                return `Request Failed. ${extraInfo}`.trim()
            case StatusCodes.NOT_FOUND:
                return `Request Failed. ${extraInfo}`.trim()
            default:
                return `Unknown status code: ${code}. ${extraInfo}`.trim()
        }
    }

    /**
     * Inserts a transaction log into the database.
     * @param reqDetails Details of the request associated with the transaction.
     * @param message The message to be logged.
     * @param response The response object to be logged.
     */
    async insertTransactionLog(
        reqDetails: any,
        message?: string,
        response?: IResponse,
    ) {
        try {
            const newTransaction = new Transaction({
                gatewayRef: reqDetails.gatewayRef,
                paymentRef: reqDetails.paymentRef,
                requestIP: '127.0.0.1',
                requestUrl: reqDetails.url,
                requestBody: reqDetails,
                status: reqDetails.status || 'pending',
                message: message || 'Default message',
                responseBody: response || {},
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Save the transaction in the database
            await newTransaction.save();
        } catch (err: any) {
            console.log(err.message)
        }
    }
}

module.exports = new Utils

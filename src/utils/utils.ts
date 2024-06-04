const { StatusCodes } = require('./constants')

interface IResponse {
    code: number
    success: boolean
    message: string
    data?: any
}

class Utils {
    createResponse(code: any, data: any, extraInfo: string = ''):IResponse{
        return {
            code,
            success: code < 300,
            message: this.getStatusCodeMessage(code, extraInfo),
            data
        }
    }

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
}

module.exports = new Utils

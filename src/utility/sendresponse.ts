import { type Response } from "express";

const sendResponse = (res: Response, payload: any) => {
    const { statusCode, success, message, data, error, user, token } = payload
    res.status(statusCode).json({
        success: success,
        message: message,
        token: token,
        user: user,
        data: data,
        error: error
    })
}

export default sendResponse
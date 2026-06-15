import { type Response } from "express";

const sendResponse = (res: Response, data: any) => {
    const { status, success, message, resData , error } = data
    res.status(status).json({
        success: success,
        message: message,
        data: resData,
        error : error
    })
}

export default sendResponse
import { type Response } from "express";

interface IResponse<T, E, U> {
    statusCode: number;
    success: boolean;
    message: string;
    token?: string;
    user?: U; 
    data?: T;
    error?: E;
}

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
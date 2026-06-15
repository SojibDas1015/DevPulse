import type { Request, Response } from "express"
import { authService } from "./auth.service"
import sendResponse from "../../utility/sendresponse"

const userSignUp = async (req: Request, res: Response) => {
    try {
        const result = await authService.userCreateFromDB(req.body)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const userLogin = async (req: Request, res: Response) => {
    try {
        const {accessToken, userData} = await authService.userLoginFromDB(req.body)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Login successful",
            token : accessToken,
            user: userData
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            errors: error
        })
    }
}

export const authController = {
    userSignUp,
    userLogin

}
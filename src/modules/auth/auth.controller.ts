import type { Request, Response } from "express"
import { authService } from "./auth.service"

const userSignUp = async (req: Request, res: Response) => {
    try {
        const result = await authService.userCreateFromDB(req.body)
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        })
    }
}

const userLogin = async (req: Request, res: Response) => {
    try {
        const {accessToken, userData} = await authService.userLoginFromDB(req.body)
        res.status(201).json({
            success: true,
            message: "Login successful",
            token : accessToken,
            user: userData
        })

    } catch (error: any) {
        res.status(500).json({
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
import type { NextFunction, Request, Response } from "express"
import type { roleType } from "../role"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../Config"
import { pool } from "../DB/server"


const authentication = (...role: roleType[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Un Authorize Access",
                    data: {}
                })
            }
            const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload
            const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1    
            `, [decode.email])
            const user = userData.rows[0]
            if (userData.rowCount === 0) {
                res.status(404).json({
                    success: false,
                    message: "user not found",
                    data: {}
                })
            }
            if (role.length && !role.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "forbidden not access able ",
                    data: {}
                })
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default authentication
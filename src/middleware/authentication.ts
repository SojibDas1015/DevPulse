import type { NextFunction, Request, Response } from "express"
import type { roleType } from "../role"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../Config"
import { pool } from "../DB/server"


const createIssues = (...role: roleType[]) => {
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
            console.log(decode)
            const userData = await pool.query(`
        SELECT * FROM users WHERE role = $1    
            `, [decode.role])
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


const authUpdate = (...role: roleType[]) => {
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
            const issueId = req.params.id;
            console.log(decode)
            const userData = await pool.query(`
        SELECT * FROM users WHERE id = $1    
            `, [issueId])
            const user = userData.rows[0]
            if (userData.rowCount === 0) {
                res.status(404).json({
                    success: false,
                    message: "user not found",
                    data: {}
                })
            }
            if (decode.role === 'maintainer') {
                req.user = decode;
                return next();
            }


            if (decode.role === 'contributor') {

                if (user.reporter_id === decode.id && user.status === 'open') {
                    req.user = decode;
                }

            }
            next()
        } catch (error) {
            next(error)
        }
    }
}


const authDeleteIssues = (...role: roleType[]) => {
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


            if (role.includes(decode.role)) {
                req.user = decode;
                return next()
            }
            res.status(401).json({
                    success: false,
                    message: "Un Authorize Access",
                    data: {}
                })
     
        } catch (error) {
            next(error)
        }
    }
}


export const authentication = { createIssues, authUpdate, authDeleteIssues }
import type { NextFunction, Request, Response } from "express"
import type { roleType } from "../role"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../Config"
import { pool } from "../DB/server"
import sendResponse from "../utility/sendresponse"


const createIssues = (...role: roleType[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized",
                })
            }
            const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload
            const userData = await pool.query(`
            SELECT * FROM users WHERE role = $1    
            `, [decode.role])
            if (userData.rowCount === 0) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Not Found",
                })
            }
            const user = userData.rows[0]
            if (role.length && role.includes(user.role)) {
                next()
            }
            else {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Forbidden",
                })
            }
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
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized",
                })
            }
            const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload
            const issueId = req.params.id;
            const userData = await pool.query(`
               SELECT * FROM issues WHERE id = $1    
            `, [issueId])

            const user = userData.rows[0]
            if (userData.rowCount === 0) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Not Found",
                })
            }
            if (decode.role === 'maintainer') {
                req.user = decode;
                return next();
            }

            if (decode.role === 'contributor') {
                if (user.reporter_id === decode.id && user.status === 'open') {
                    req.user = decode;
                    next()
                }
                else {
                    sendResponse(res, {
                        statusCode: 400,
                        success: false,
                        message: "Not Own issue or Status Not open",
                    })
                }

            }
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
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized",
                })
            }
            const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload
            if (role.includes(decode.role)) {
                req.user = decode;
                return next()
            }
            sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "Forbidden",
            })
        } catch (error) {
            next(error)
        }
    }
}


export const authentication = { createIssues, authUpdate, authDeleteIssues }
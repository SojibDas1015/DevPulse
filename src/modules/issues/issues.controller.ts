import type { Request, Response } from "express"
import { issuesService } from "./issues.service"
import sendResponse from "../../utility/sendresponse"

const createIssues = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization
        const result = await issuesService.createIssuesFromDB(req.body, token as string)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        })

    } catch (error: unknown) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error
        })
    }
}

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.getAllFromDB(req.query)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrived successfully",
            data: result?.rows
        })

    } catch (error: unknown) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error
        })
    }
}


const getSingleIssues = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await issuesService.getSingleIssuesFromDB(id as string)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issues retrived successfully",
            data: result.rows[0]
        })
    } catch (error: unknown) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error
        })
    }
}

const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await issuesService.updateIssueFromDB(req.body, id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0]
        })
    } catch (error: unknown) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error
        })
    }

}

const issuesDelete = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await issuesService.issuesDeleteFromDB(id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
        })
    } catch (error: unknown) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error
        })
    }
}

export const issuesController = {
    createIssues,
    getAllIssues,
    getSingleIssues,
    updateIssue,
    issuesDelete
}
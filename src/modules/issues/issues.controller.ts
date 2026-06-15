import type { Request, Response } from "express"
import { issuesService } from "./issues.service"

const createIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.createIssuesFromDB(req.body)
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.getAllFromDB(req.query)
        res.status(200).json({
            success: true,
            message: "Issues retrived successfully",
            data: result?.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        })
    }
}


const getSingleIssues = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await issuesService.getSingleIssuesFromDB(id)
        res.status(200).json({
            success: true,
            message: "Issues retrived successfully",
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

const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await issuesService.updateIssueFromDB(req.body, id as string)
        console.log(result.rows)
        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
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


const issuesDelete = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        console.log(id)
        const result = await issuesService.issuesDeleteFromDB(id as string)
        res.status(200).json({
            success: true,
            message: "Issue deleted successfully"
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
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
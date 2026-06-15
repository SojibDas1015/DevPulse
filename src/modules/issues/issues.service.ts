import config from "../../Config";
import { pool } from "../../DB/server";
import jwt, { type JwtPayload } from "jsonwebtoken"


interface createIssuesFromDBType {
    
}

const createIssuesFromDB = async (payload: any, token : string) => {
    console.log(payload)
    const { title, description, type } = payload;
    const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload
    const reporter_id = decode.id
    const issues = await pool.query(`
    INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4)
    RETURNING *
        `, [title, description, type, reporter_id])
    return issues

}

const getAllFromDB = async (payload: any) => {
    console.log(payload)
    const { sort, type, status } = payload
    console.log(sort, type, status)
    if (!sort && !type && !status) {
        const issues = await pool.query(`
    SELECT * FROM issues
        `)
        return issues
    }
    else if (sort) {
        if (sort === "newest") {
            const issues = await pool.query(`
    SELECT * FROM issues ORDER BY create_at ASC
        `)
            return issues
        }
        else if (sort === "oldest") {
            const issues = await pool.query(`
    SELECT * FROM issues ORDER BY create_at DESC
        `)
            return issues
        }
    }
    else if (type) {
        if (type === "bug") {
            const issues = await pool.query(`
    SELECT * FROM issues WHERE type = $1
        `, [type])
            return issues
        }
        else if (type === "feature_request") {
            const issues = await pool.query(`
    SELECT * FROM issues WHERE type = $1
        `, [type])
            return issues
        }
    }
    else if (status) {
        if (status === "open") {
            const issues = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status])
            return issues
        }
        else if (status === "in_progress") {
            const issues = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status])
            return issues
        }
        else if (status === "resolved") {
            const issues = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status])
            return issues
        }
    }

}

const getSingleIssuesFromDB = async (id: any) => {
    const issues = await pool.query(`
    SELECT * FROM issues WHERE id=$1    
        `, [id])

    if (issues.rowCount === 0) {
        throw new Error("Issues Not Found")
    }
    return issues
}

const updateIssueFromDB = async (payload: any, id : string) => {
    const { title, description, type } = payload;
    console.log(title, description, type, id)
    const issues = await pool.query(`
    UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type) WHERE id=$4
    RETURNING *
        `, [title, description, type, id])
    return issues

}

const issuesDeleteFromDB = async(id : string)=>{
    const issues = pool.query(`
    DELETE FROM issues WHERE id = $1
        `, [id])
        return issues
}


export const issuesService = {
    createIssuesFromDB,
    getAllFromDB,
    getSingleIssuesFromDB,
    updateIssueFromDB,
    issuesDeleteFromDB
}
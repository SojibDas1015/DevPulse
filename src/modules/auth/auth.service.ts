import { pool } from "../../DB/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../Config"

const userCreateFromDB = async (payload: any) => {
    const { name, email, password, role } = payload
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)
    const result = await pool.query(`
    INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, COALESCE($4, 'contributor'))
    RETURNING *
        `, [name, email, passwordHash, role])
    console.log(result)
    delete result.rows[0].password
    return result
}

const userLoginFromDB = async (payload: any) => {
    // 1console.log(payload)
    const { email, password } = payload;
    const user = await pool.query(`
    SELECT * FROM users WHERE email = $1
        `, [email])
    const userData = user.rows[0]
    if(user.rowCount === 0){
        throw new Error("Email Not Found")
    }
    const compare = bcrypt.compare(password, userData.password)
    if(!compare){
        throw new Error("Invalid Password")
    }

    const jwtPayload = {
        id : userData.id,
        name : userData.name,
        role : userData.role
    }

    const accessToken = jwt.sign(jwtPayload, config.secret_key as string, {expiresIn : "2d"})
    delete userData.password
    return {accessToken, userData}
    // console.log(user.rows[0])

}

export const authService = {
    userCreateFromDB,
    userLoginFromDB

}
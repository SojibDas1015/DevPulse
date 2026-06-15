import {Pool} from "pg"
import config from "../Config"

export const pool = new Pool({
    connectionString : config.connection_string
})


export const initDb = async()=>{
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email  VARCHAR(60) UNIQUE NOT NULL,
    password TEXT UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'contributor',

    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()

    )
        `);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    CONSTRAINT check_type CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(20) DEFAULT 'open',
    reporter_id INT NOT NULL,

    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()

    )    
        `);
    console.log("Neon DB is Connected")
}
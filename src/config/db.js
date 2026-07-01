import { Pool } from "pg"
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: false,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
})

export const testDbConnection = async () => {
    try {
        const client = await pool.connect()
        console.log('Connected to database')
        client.release()
    } catch (error) {
        console.log(error)
        console.log('Error connecting to database')
    }
}

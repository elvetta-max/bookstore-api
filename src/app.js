import dotenv from 'dotenv'
import express, { urlencoded } from 'express'
import cors from 'cors'
import { testDbConnection } from './config/db.js'
import { userRouter } from './routes/userRoutes.js'
import { bookRouter } from './routes/bookRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { orderRouter } from './routes/orderRoutes.js'
import { cert, initializeApp } from 'firebase-admin/app'
 
dotenv.config()
const app = express()
const PORT = process.env.SERVER_PORT || 3000
const URL_BASE = process.env.URL_BASE



app.use(cors({
    origin:["http://localhost:5173", "https://bookstore-api-rwfh.onrender.com"]
    credentials: true
}))

 
app.use(express.json())
app.use(express.urlencoded())


initializeApp({
    credential: cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
    })
})

app.use('/users', userRouter)
app.use('/books', bookRouter)
app.use('/auth', authRouter)
app.use('/orders', orderRouter)


const test = async () => await testDbConnection()
test()

app.listen(PORT, () => {
    console.log(`Server is listenning to port: ${PORT}`)
})

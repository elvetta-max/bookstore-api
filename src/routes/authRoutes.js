
import express from 'express'
import { authenticate } from '../middlewares/verifyGoogleToken.js'
import { findOrCreateUser, getAuthUser, logout } from '../controllers/userController.js'

export const authRouter = express.Router()

authRouter.get('/user', authenticate, getAuthUser)
authRouter.get('/user/logout', logout)
authRouter.post('/google', authenticate, findOrCreateUser)
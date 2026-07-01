
 import express from "express"
import {  addFavorite, getUserFavorites, getUserLibrary, getUserProfile, removeFavorite, updateUserProfile } from "../controllers/userController.js"
import { requireAdmin } from "../middlewares/requireAdmin.js"
import { authenticate } from "../middlewares/verifyGoogleToken.js"

export const userRouter = express.Router()


userRouter.get('/library', authenticate, getUserLibrary)

userRouter.get('/favorites', authenticate, getUserFavorites)
userRouter.post('/favorites/:bookId', authenticate, addFavorite)
userRouter.delete('/favorites/:bookId', authenticate, removeFavorite)

userRouter.get('/profile', authenticate, getUserProfile)
userRouter.put('/profile/save', authenticate, updateUserProfile)
 
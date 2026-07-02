import { pool } from "../config/db.js"
import { findUserByEmail, addNewUserToDb, getUserProfileFromDb, saveUserProfileInDb, getBookInFavoritesFromDb, addFavoriteToDb, getUserFavoritesFromDb, removeFavoriteFromDb, getUserLibraryFromDb } from "../models/user.js"
import dotenv from 'dotenv'
import { userQueries } from "../utils/queries.js"
dotenv.config()

const isProduction = process.env.PROJECT_ENV === 'production'


export const getAuthUser = async (req, res) => {

    try {

        const { email } = req.user
        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(404).json({ ok: false, message: "No user found" })
        }

        res.status(200).json({
            ok: true,
            message: "User successfully authenticated",
            user: {
                ...user, user_role: user.user_role
            }
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ ok: false, message: "Server error" })
    }
}

export const findOrCreateUser = async (req, res) => {

    try {

        const decodedToken = req.user
        const token = req.token
        const { uid: userID, name, email } = decodedToken

        let user = await findUserByEmail(email)

        if (!user) {
            user = await addNewUserToDb(userID, name, email)
        }

/*
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })*/
            res.status(200).json({
            ok: true,
            message: "Successfully logged in",
            user
        })


    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Server error",
            error
        })
    }
}

export const getUserProfile = async (req, res) => {

    try {

        const { email } = req.user

        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(404).json({ ok: false, message: "User not found" })
        }

        const profileData = await getUserProfileFromDb(user.user_id)

        res.status(200).json({
            ok: true,
            profile: profileData
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({ ok: false, message: "Error loading profile" })
    }
}

export const updateUserProfile = async (req, res) => {

    try {

        const userId = req.user.uid
        const profileData = req.body

        const saveSuccess = await saveUserProfileInDb(userId, profileData)

        res.status(200).json({
            ok: true,
            message: "Profile updated successfully"
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({ ok: false, message: "Error profile update" })
    }
}


export const getUserLibrary = async (req, res) => {

    try {

        const userId = req.user.uid
        const books = await getUserLibraryFromDb(userId)

        res.status(200).json({
            ok: true,
            books
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({ ok: false, message: "Server Error: Can not get librray" })
    }
}


export const getUserFavorites = async (req, res) => {

    try {

        const userId = req.user.uid
        const favorites = await getUserFavoritesFromDb(userId)

        res.status(200).json({
            ok: true,
            favorites
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({ ok: false, message: "Server Error; Failed to get fav" })
    }
}

export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.uid
        const { bookId } = req.params

        const bookInFav = await getBookInFavoritesFromDb(userId, bookId)

        if (bookInFav) {
            return res.status(400).json({
                ok: false,
                message: "Book already in favorites"
            })
        }

        const fav = await addFavoriteToDb(userId, bookId)

        res.status(201).json({
            ok: true,
            message: "Added to favorites",
            favorite: fav
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Failed to add favorite"
        })
    }
}

export const removeFavorite = async (req, res) => {

    try {

        const userId = req.user.uid
        const { bookId } = req.params

        const removedBook = await removeFavoriteFromDb(userId, bookId)

        if (!removedBook) {
            return res.status(404).json({
                ok: false,
                message: "Favorite not found"
            })
        }

        res.status(200).json({
            ok: true,
            message: "Removed from favorites"
        })

    } catch (error) {
        console.log("Remove favorite error:", error)

        res.status(500).json({
            ok: false,
            message: "Failed to remove favorite"
        })
    }
}



export const logout = async (req, res) => {


    return res.clearCookie('auth_token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
    }).status(200).json({
        ok: true,
        message: "Successfully logged out"
    })

}

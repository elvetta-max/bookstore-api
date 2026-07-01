import { pool } from "../config/db.js"
import { userQueries } from "../utils/queries.js"

export const findUserByEmail = async (email) => {

    const resp = await pool.query(
        userQueries.findUserByEmail,
        [email]
    )
    return resp.rows[0]
}

export const addNewUserToDb = async (userId, name, email) => {

    const resp = await pool.query(
        userQueries.addNewUser,
        [userId, name, email]
    )
    return resp.rows[0]
}

export const getUserProfileFromDb = async (userId) => {

    const resp = await pool.query(
        userQueries.getUserProfile,
        [userId]
    )
    return resp.rows[0]
}

export const addNewCollection = async (userId, bookId) => {

    const resp = await pool.query(
        userQueries.addBookToUserLibrary,
        [userId, bookId]
    )
    return resp.rows[0]
}

export const getUserLibraryFromDb = async (userId) => {

    const resp = await pool.query(
        userQueries.getUserLibrary,
        [userId]
    )
    return resp.rows
}

export const getUserFavoritesFromDb = async (userId) => {

    const resp = await pool.query(
        userQueries.getUserFavs,
        [userId])

    return resp.rows
}

export const getBookInFavoritesFromDb = async (userId, bookId) => {

    const resp = await pool.query(
        userQueries.getBookInFav,
        [userId, bookId])

    return resp.rows[0]
}

export const addFavoriteToDb = async (userId, bookId) => {

    const resp = await pool.query(
        userQueries.addFavorite,
        [userId, bookId])

    return resp.rows[0]
}

export const removeFavoriteFromDb = async (userId, bookId) => {

    const resp = await pool.query(
        userQueries.removeFavorite,
        [userId, bookId])

    return resp.rows[0]
}

const updateUserDisplayName = async (userId, displayName) => {

    const resp = await pool.query(
        userQueries.updateUserDisplayName,
        [displayName, userId]
    )
    if (resp) {
        console.log("User is updated successfully")
    }
}

const saveUserAddress = async (userId, addressData) => {

    const { firstName, lastName, adress, zipCode, city, province, country } = addressData

    const check = await pool.query(
        userQueries.getUserAddress,
        [userId]
    )

    const addressId = check.rows[0]?.address_id

    if (addressId) {
        await pool.query(
            userQueries.updateUserAddress,
            [firstName, lastName, adress, zipCode, city, province, country, addressId]
        )
    } else {

        await pool.query(
            userQueries.createUserAddress,
            [userId, firstName, lastName, adress, zipCode, city, province, country]
        )
    }
}

export const saveUserProfileInDb = async (userId, profileData) => {

    const { displayName, firstName, lastName, adress, zipCode, city, province, country } = profileData

    await updateUserDisplayName(userId, displayName)

    await saveUserAddress(userId, { firstName, lastName, adress, zipCode, city, province, country })

    return true
}


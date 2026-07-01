import { pool } from "../config/db.js"
import { bookQueries } from "../utils/queries.js"

const { getAllBooksQuery, addNewBookQuery, getBookByIdQuery, pdateBookQuery, deleteBookQuery, updateBookQuery } = bookQueries

export const getAllBooksFromDb = async (page = 1, limit = 10) => {

    const offset = (page * limit) - limit

    const resp = await pool.query(getAllBooksQuery,
        [offset, limit])
    return resp.rows
}

export const deleteBookFromDb = async (bookId) => {

    const resp = await pool.query(deleteBookQuery, [bookId])

    return resp.rows[0]
}


export const addNewBookToDb = async (book) => {
    const {
        title,
        author,
        description,
        price,
        electronic_version,
        physical_version,
        quantity,
        file_url,
        cover_image,
        admin_id,
        isbn
    } = book

    const resp = await pool.query(addNewBookQuery,
        [title, author, description, price, electronic_version, physical_version, quantity, file_url, cover_image, admin_id, isbn])

    return resp.rows[0]
}


export const getBookByIdFromDb = async (bookId) => {

    const resp = await pool.query(getBookByIdQuery, [bookId])

    return resp.rows[0]
}

export const updateBookFromDb = async (bookId, book) => {

    const {
        title, author, description, price,
        electronic_version, physical_version,
        quantity, file_url,
        cover_image,
        isbn
    } = book

    const resp = await pool.query(
        updateBookQuery,
        [title, author, description, price, electronic_version,
            physical_version, quantity, file_url, cover_image, isbn,
             bookId])

    return resp.rows[0]
}


import { addNewBookToDb, deleteBookFromDb, getAllBooksFromDb, getBookByIdFromDb, updateBookFromDb } from "../models/book.js"


export const getAllBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query

        const books = await getAllBooksFromDb(Number(page), Number(limit))

        res.status(200).json({
            ok: true,
            message: 'Success getting books',
            page: Number(page),
            limit: Number(limit),
            books
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: 'Server Error'
        })
    }
}


export const getBookById = async (req, res) => {

    try {

        const { bookId } = req.params
        const book = await getBookByIdFromDb(bookId)

        if (!book) {
            return res.status(403).json({
                ok: false,
                message: 'Book not found'
            })
        }

        res.status(200).json({
            ok: true,
            message: 'Success getting book',
            book
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Server error'
        })
    }
}

export const deleteBookById = async (req, res) => {

    try {
        const { bookId } = req.params

        const book = await deleteBookFromDb(bookId)

        if (!book) {
            return res.status(404).json({
                ok: false,
                message: 'Book not found'
            })
        }

        res.status(200).json({
            ok: true,
            message: 'Book deleted successfully',
            book
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: 'Server Error'
        })
    }
}


export const addNewBook = async (req, res) => {
    try {

        const { body, files } = req
        const adminId = req.user.uid

        const coverImageUrl = files?.cover_image?.[0]?.path
        const bookFileUrl = files?.file_url?.[0]?.path
        const isPhysical = body.physical_version === "true" || body.physical_version === true
        const isElectronic = body.electronic_version === "true" || body.electronic_version === true
        const isbn = body.isbn && body.isbn.trim() !== "" ? body.isbn : null

        const newBook = {
            ...body,
            isbn: isbn,
            cover_image: coverImageUrl,
            file_url: bookFileUrl,
            admin_id: adminId
        }

        if (!isPhysical && !isElectronic) {

            return res.status(400).json({
                ok: false,
                message: 'Book must have at least a version: Physical or Electronic'
            })
        }

        const book = await addNewBookToDb(newBook)

        if (!book) {
            return res.status(500).json({
                ok: false,
                message: 'Couldnt add book to db'
            })
        }

        res.status(201).json({
            ok: true,
            message: 'Book created successfully',
            book
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: 'Server Error'
        })
    }
}

export const updateBookById = async (req, res) => {

    try {
        const { bookId } = req.params
        const { files, body } = req
        const coverImageUrl = files?.cover_image?.[0]?.path
        const bookFileUrl = files?.file_url?.[0]?.path

        const book = {
            ...body,
            cover_image: coverImageUrl,
            file_url: bookFileUrl,
        }

        const updatedBook = await updateBookFromDb(bookId, book)

        if (!updatedBook) {
            return res.status(404).json({
                ok: false,
                message: 'Book not found'
            })
        }

        res.status(200).json({
            ok: true,
            message: 'Book updated successfully',
            book: updatedBook
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Server Error'
        })
    }
}


import express from "express";

import { addNewBook, deleteBookById, getAllBooks, getBookById, updateBookById } from "../controllers/bookController.js";
import { uploadBookFiles } from "../config/cloudinary.js";
import { authenticate } from "../middlewares/verifyGoogleToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
export const bookRouter = express.Router()

 
bookRouter.get('/', getAllBooks)
bookRouter.get('/:bookId', getBookById) 
bookRouter.delete('/:bookId', deleteBookById) //todo,  id validation
bookRouter.post('/',authenticate, requireAdmin, uploadBookFiles, addNewBook)//Todo  data validation
bookRouter.put('/:bookId',uploadBookFiles, updateBookById)//Todo admin verification + data validation



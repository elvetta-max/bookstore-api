import express from "express"
import { authenticate } from "../middlewares/verifyGoogleToken.js"
import { createCheckoutSession, confirmPaymentAndSaveBooks, getUserOrders, getOrderById } from "../controllers/orderController.js"


export const orderRouter = express.Router()


orderRouter.post('/checkout', authenticate, createCheckoutSession)
orderRouter.post('/confirm', authenticate, confirmPaymentAndSaveBooks)
orderRouter.get('/', authenticate, getUserOrders)
orderRouter.get('/:orderId', authenticate, getOrderById)


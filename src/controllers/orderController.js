import Stripe from "stripe"
import { pool } from "../config/db.js"
import dotenv from 'dotenv'
import { addNewCollection } from "../models/user.js"
import { getUserOrdersFromDb, getOrderByIdFromDb, getOrderItemsFromDb, updateOrderStatus, createOrderInDb, addBookToOrderInDb } from "../models/order.js"

dotenv.config()

const clientBaseUrl = process.env.CLIENT_BASE_URL
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req, res) => {

    try {
        const { cartItems } = req.body
        const userId = req.user.uid

        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.cover_image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }))

        const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const orderId = await createOrderInDb(userId, totalPrice)

        for (const item of cartItems) {
            await addBookToOrderInDb(orderId, item.book_id)
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            metadata: {
                userId: userId,
                orderId: String(orderId),
                bookIds: JSON.stringify(cartItems.map(b => b.book_id))
            },
            success_url: `${clientBaseUrl}/cart/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientBaseUrl}/cart`,
        })

        res.status(200).json({
            ok: true,
            message: "Payment session created successfully",
            url: session.url
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Server error cant complete session"
        })
    }
}

export const confirmPaymentAndSaveBooks = async (req, res) => {

    try {

        const { sessionId } = req.body
        //   console.log("Stripe session ID on confirm page", sessionId)

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === "paid") {

            const userId = session.metadata.userId
            const bookIds = JSON.parse(session.metadata.bookIds)
            const orderId = session.metadata.orderId

            await updateOrderStatus(orderId)

            for (const bookId of bookIds) {
                await addNewCollection(userId, bookId)
            }

            return res.status(200).json({
                ok: true,
                message: "Added books to user collections"
            })
        }

        res.status(400).json({
            ok: false,
            message: "Error payment"
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Server Error"
        })
    }
}


export const getUserOrders = async (req, res) => {

    try {

        const userId = req.user.uid
        const orders = await getUserOrdersFromDb(userId)

        res.status(200).json({
            ok: true,
            orders
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Server Error"
        })
    }
}

export const getOrderById = async (req, res) => {

    try {

        const userId = req.user.uid
        const { orderId } = req.params

        const order = await getOrderByIdFromDb(orderId, userId)

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: "Order not found"
            })
        }

        const items = await getOrderItemsFromDb(orderId)

        res.status(200).json({
            ok: true,
            order,
            items
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            message: "Coudl not get order details"
        })
    }
}
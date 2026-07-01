import { pool } from "../config/db.js"
import { orderQueries } from "../utils/queries.js"

export const getUserOrdersFromDb = async (userId) => {

    const resp = await pool.query(
        orderQueries.getUserOrders,
        [userId])

    return resp.rows
}

export const createOrderInDb = async (userId, totalPrice) => {

    
  const resp = await pool.query(
    orderQueries.createOrder,
    [userId, totalPrice, 'pending']
  )
  return resp.rows[0].order_id
}

export const addBookToOrderInDb = async (orderId, bookId) => {
  await pool.query(
    orderQueries.addBookToOrder,
    [orderId, bookId]
  )
}

export const updateOrderStatus = async (orderId) => {

    await pool.query(
        orderQueries.updateOrderStatus
        , [orderId])
}


export const getOrderByIdFromDb = async (orderId, userId) => {

    const resp = await pool.query(
        orderQueries.getOrderById,
        [orderId, userId])

    return resp.rows[0]
}

export const getOrderItemsFromDb = async (orderId) => {

    const resp = await pool.query(
        orderQueries.getOrderItems,
        [orderId])

    return resp.rows

}
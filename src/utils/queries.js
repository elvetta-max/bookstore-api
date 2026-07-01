export const bookQueries = {

  getAllBooksQuery: `SELECT * FROM books ORDER BY book_id OFFSET $1 LIMIT $2`,

  deleteBookQuery: `DELETE FROM books WHERE book_id = $1 RETURNING *`,

  getBookByIdQuery: `SELECT * FROM books WHERE book_id = $1`,

  addNewBookQuery: `
    INSERT INTO books (title, author, description, price, electronic_version, physical_version, quantity, file_url, cover_image, admin_id, isbn)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,

  updateBookQuery: `UPDATE books
    SET title = $1, author = $2, description = $3, price = $4,
        electronic_version = $5, physical_version = $6, quantity = $7,
        file_url = $8, cover_image = $9, isbn = $10
    WHERE book_id = $11
    RETURNING *`

}

export const userQueries = {

  addNewUser: `INSERT INTO users (user_id, display_name, email) VALUES ($1, $2, $3) RETURNING *`,

  findUserByEmail: `SELECT user_id, display_name, email, user_role FROM users WHERE email = $1`,

  changeUserRoleQuery: `UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *`,

  getUserProfile: ` SELECT 
              u.user_id,
              u.display_name,
              u.email,
              a.address_id,
              a.first_name,
              a.last_name,
              a.adress,
              a.zip_code,
              a.city,
              a.province,
              a.country
          FROM users u
          LEFT JOIN addresses a ON u.user_id = a.user_id
          WHERE u.user_id = $1`,

  getUserAddress: `SELECT address_id FROM addresses WHERE user_id = $1`,

  updateUserNameQuery: `UPDATE users SET display_name = $1 WHERE user_id = $2`,

  updateUserDisplayName: `UPDATE users SET display_name = $1 WHERE user_id = $2`,

  addBookToUserLibrary: `INSERT INTO user_library (user_id, book_id) VALUES ($1, $2) RETURNING *`,


  getUserLibrary: ` SELECT 
              b.book_id,
              b.title,
              b.author,
              b.description,
              b.price,
              b.cover_image,
              ul.purchased_at
          FROM user_library ul
          JOIN books b ON ul.book_id = b.book_id
          WHERE ul.user_id = $1
          ORDER BY ul.purchased_at DESC `,

  createUserAddress: `INSERT INTO addresses 
             (user_id, first_name, last_name, adress, zip_code, city, province, country)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,

  updateUserAddress: `UPDATE addresses 
             SET first_name = $1, last_name = $2, adress = $3, zip_code = $4, city = $5, 
             province = $6, country = $7
             WHERE address_id = $8`,

  getUserFavs: ` SELECT 
                         b.book_id,
                         b.title,
                         b.author,
                         b.price,
                         b.cover_image
                     FROM favorites f
                     JOIN books b ON f.book_id = b.book_id
                     WHERE f.user_id = $1
                     ORDER BY f.favorite_id DESC `,

  getBookInFav: `SELECT * FROM favorites WHERE user_id = $1 AND book_id = $2`,

  addFavorite: ` INSERT INTO favorites (user_id, book_id) VALUES ($1, $2) RETURNING *`,

  removeFavorite: `DELETE FROM favorites WHERE user_id = $1 AND book_id = $2 RETURNING *`,

}

export const orderQueries = {
  
  createOrder: ` INSERT INTO orders (user_id, total_price, order_status) VALUES ($1, $2, $3) RETURNING order_id`,

  addBookToOrder: `INSERT INTO orders_books (order_id, book_id) VALUES ($1, $2)`,

  updateOrderStatus: `UPDATE orders SET order_status = 'paid' WHERE order_id = $1`,

  getUserOrders: `SELECT 
      o.order_id,
      o.order_date,
      o.total_price,
      o.order_ref,
      o.order_status,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    WHERE o.user_id = $1
    ORDER BY o.order_date DESC `,

  getOrderById: ` SELECT 
      o.order_id,
      o.order_date,
      o.total_price,
      o.order_ref,
      o.order_status,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = $1 AND o.user_id = $2`,

  getOrderItems: `SELECT 
      b.book_id,
      b.title,
      b.price,
      b.cover_image
    FROM orders_books ob
    JOIN books b ON ob.book_id = b.book_id
    WHERE ob.order_id = $1 `
}
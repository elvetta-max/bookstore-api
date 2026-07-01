import { getAuth } from "firebase-admin/auth"
import { findUserByEmail } from "../models/user.js" 


export const requireAdmin = async (req, res, next) => {

    try {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: "No token found" })
        }

        const user = await findUserByEmail(req.user.email)

        if (!user || user.user_role !== 'admin') {
            return res.status(403).json({ ok: false, message: "Access denied" })
        }

        return next()

    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, message: "Server error" })
    }
}
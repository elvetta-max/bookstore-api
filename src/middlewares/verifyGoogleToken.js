import { getAuth } from 'firebase-admin/auth'



export const authenticate = async (req, res, next) => {

    try {

        let token = null

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ ok: false, message: "No token found" })
        }

        const decodedToken = await getAuth().verifyIdToken(token)
        req.user = decodedToken
        req.token = token

        return next()

    } catch (error) {
        console.log("Auth error:", error)
        return res.status(403).json({ ok: false, message: "Invalid or expired token" })
    }
}

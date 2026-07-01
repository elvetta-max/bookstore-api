import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({

    cloudinary,
    params: (req, file) => {
        if (file.fieldname === "cover_image") {
            return {
                folder: "books/covers",
                resource_type: "image",
                allowed_formats: ["jpg"]
            }
        }

        return {
            folder: "books/files",
            resource_type: "raw",
            allowed_formats: ["pdf"]
        }
    }

})

const upload = multer({ storage })

export const uploadBookFiles = upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "file_url", maxCount: 1 }
])

export { cloudinary }
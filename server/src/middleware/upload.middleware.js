import multer from "multer";
/*
// ------------- Multer.DiskStorage -------------
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // current file name with path i.e .../server/src/utils/upload.js
const __dirname = path.dirname(__filename); // current file directory name with path i.e .../server/src/utils

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // creates the directory if it doesn't exist, and the { recursive: true } option allows it to create nested directories as well.
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); //  the directory where the uploaded file will be stored.
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
*/

// ------------- Multer.MemoryStorage -------------
const storage = multer.memoryStorage();
// now instead of req.file.path we can use file's buffer in bytes => (req.file.buffer)

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp",
        "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-matroska"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};

const upload = multer({
    storage, // tells multer to use the disk storage configuration defined above for file storage.
    fileFilter, // tells multer to use the file filter defined above for file filtering.
    limits: { fileSize: 20 * 1024 * 1024 } // sets limits on the size of the uploaded file, rejecting any file larger than 20MB
});

/* 

// upload single file
upload.single("image") // right now only single image upload is in use

// upload multiple files
upload.array("images", 10) // array method uploads an array of files

// upload mixed files (some single, some arrays)
upload.fields([{ name: "avatar", maxCount: 1 }, { name: "photos", maxCount: 8 }]) // fields method uploads a mix of files with specified max counts

*/

export default upload;
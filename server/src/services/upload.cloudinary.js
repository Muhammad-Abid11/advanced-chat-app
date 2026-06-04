import cloudinary from "../config/cloudinary.js";

/* // Multer.DiskStorage (file path)
export const uploadChatImage = async (filePath) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "chat-images",
    });

    return result;
}; */

// ------------------ Multer.MemoryStorage (buffer) ------------------
export const uploadChatImage = (buffer) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "chat-images"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};
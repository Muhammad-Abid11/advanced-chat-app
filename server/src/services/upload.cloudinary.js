import cloudinary from "../config/cloudinary.js";

export const uploadChatImage = async (filePath) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "chat-images",
    });

    return result;
};
import fs from "fs/promises";
import Message from "./message.model.js";
import Chat from "./chat.model.js";
import User from "../auth/auth.model.js";
import { getIO } from "../../config/socket.js";
import { uploadChatImage } from "../../services/upload.cloudinary.js";

// Send a new message
export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    let imagePath = "";

    if (req.file) {
        // saved locally without cloud storage
        // imagePath = `/uploads/${req.file.filename}`; 

        // upload to cloud storage(try catch finally is due to delete local file either image upload success or error)
        try {
            const result = await uploadChatImage(req.file.path); // uploaded image to cloudinary
            imagePath = result.secure_url; // get uploaded image url
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
        } finally {
            await fs.unlink(req.file.path).catch(err => console.error("Error deleting local file:", err)); // delete local file
        }
    }

    if (!content && !imagePath) {
        return res.status(400).json({ message: "Message content or image is required" });
    }

    if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required" });
    }

    const newMessage = {
        senderId: req.user.user_id,
        content: content || "",
        image: imagePath,
        chatId: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("senderId", "name email");
        message = await message.populate("chatId");
        message = await User.populate(message, {
            path: "chatId.participants",
            select: "name email",
        });

        // Update last message in Chat
        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: message._id,
        });

        // Emit socket event for real-time update
        const io = getIO();
        io.to(chatId).emit("message received", message);

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all messages for a specific chat
export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate("senderId", "name email")
            .populate("chatId");
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

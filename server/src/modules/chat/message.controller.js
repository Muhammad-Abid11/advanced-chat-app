import Message from "./message.model.js";
import Chat from "./chat.model.js";
import User from "../auth/auth.model.js";
import { getIO } from "../../config/socket.js";

// Send a new message
export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: "Invalid data passed into request" });
    }

    const newMessage = {
        senderId: req.user.user_id,
        content: content,
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

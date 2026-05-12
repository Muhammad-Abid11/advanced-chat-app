import Chat from "./chat.model.js";
import User from "../auth/auth.model.js";

// Create or fetch one-on-one chat
export const createChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "UserId param not sent with request" });
    }

    try {
        // Check if a chat already exists between these two users
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { participants: { $elemMatch: { $eq: req.user.user_id } } },
                { participants: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("participants", "-password")
            .populate("lastMessage");

        // Further populate lastMessage sender
        isChat = await User.populate(isChat, {
            path: "lastMessage.senderId",
            select: "name email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            // Create new chat
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                participants: [req.user.user_id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "participants",
                "-password"
            );
            res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all chats for the logged-in user
export const getAllChatsLastMessage = async (req, res) => {
    try {
        let results = await Chat.find({ participants: { $elemMatch: { $eq: req.user.user_id } } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })

        results = await User.populate(results, {
            path: "lastMessage.senderId",
            select: "name email",
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get specific chat by ID
export const getChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findOne({ _id: chatId })
            .populate("participants", "-password")
            .populate("lastMessage");

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Optional: Function to fetch chat messages (could be in a separate controller)
// export const getChatMessages = async (req, res) => { ... }

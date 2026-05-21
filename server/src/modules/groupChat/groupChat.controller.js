import Chat from "../chat/chat.model.js";

// Create a new Group Chat
export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    let users = req.body.users;
    if (typeof users === "string") {
        try {
            users = JSON.parse(users);
        } catch (e) {
            return res.status(400).json({ message: "Invalid users list format" });
        }
    }

    if (users.length < 2) {
        return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
    }

    // Add current logged-in user to the participants list
    users.push(req.user.user_id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            participants: users,
            isGroupChat: true,
            groupAdmin: req.user.user_id,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Rename Group Chat Name
export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
        return res.status(400).json({ message: "chatId and chatName are required" });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName: chatName },
            { new: true }
        )
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add User to Group Chat
export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        if (chat.participants.includes(userId)) {
            return res.status(400).json({ message: "User is already in the group" });
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { participants: userId } },
            { new: true }
        )
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(added);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove User from Group Chat or Leave Group
export const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { participants: userId } },
            { new: true }
        )
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        if (removed && removed.participants.length === 0) {
            await Chat.findByIdAndDelete(chatId);
            return res.status(200).json({ message: "Group deleted since all members left", chatDeleted: true, chatId });
        }

        // If the admin left, assign next participant as admin
        if (removed && removed.groupAdmin && removed.groupAdmin.toString() === userId.toString()) {
            const nextAdmin = removed.participants[0]._id;
            const updatedWithNewAdmin = await Chat.findByIdAndUpdate(
                chatId,
                { groupAdmin: nextAdmin },
                { new: true }
            )
                .populate("participants", "-password")
                .populate("groupAdmin", "-password");

            return res.status(200).json(updatedWithNewAdmin);
        }

        res.status(200).json(removed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

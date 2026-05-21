import api from "../../config/axios";

export const createGroupChatApi = async (name, users) => {
    return await api.post("/api/group", { name, users });
};

export const renameGroupApi = async (chatId, chatName) => {
    return await api.put("/api/group/rename", { chatId, chatName });
};

export const addToGroupApi = async (chatId, userId) => {
    return await api.put("/api/group/add", { chatId, userId });
};

export const removeFromGroupApi = async (chatId, userId) => {
    return await api.put("/api/group/remove", { chatId, userId });
};

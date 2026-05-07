import api from "../../config/axios";

export const fetchChatsApi = async () => {
    return await api.get("/api/chat");
};

export const createChatApi = async (userId) => {
    return await api.post("/api/chat", { userId });
};

export const fetchMessagesApi = async (chatId) => {
    return await api.get(`/api/chat/messages/${chatId}`);
};

export const fetchChatByIdApi = async (chatId) => {
    return await api.get(`/api/chat/${chatId}`);
};

export const sendMessageApi = async (content, chatId) => {
    return await api.post("/api/chat/messages", { content, chatId });
};

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

export const sendMessageApi = async (data) => {
    // data can be JSON or FormData depending on whether an image is attached
    if (data instanceof FormData) {
        return await api.post("/api/chat/messages", data, {
            headers: {
                "Content-Type": "multipart/form-data", // It tells the server to expect binary data in the request body (suitable for file uploads). Without this header, the server might not parse the request body correctly, leading to the image data being lost.
            },
        });
    }
    return await api.post("/api/chat/messages", data);
};

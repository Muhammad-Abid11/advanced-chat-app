import { create } from "zustand";
import { fetchChatsApi, createChatApi, fetchMessagesApi, sendMessageApi, fetchChatByIdApi } from "../api/chat/chat.api";
import { getSocket } from "../config/socket";

const useChatStore = create((set, get) => ({
    chats: [],
    messages: [],
    selectedChat: null,
    isChatsLoading: false,
    isMessagesLoading: false,

    setChats: (chats) => set({ chats }),
    setSelectedChat: (selectedChat) => set({ selectedChat }),

    createChat: async (userId) => {
        try {
            const res = await createChatApi(userId);
            const newChat = res.data;

            // ✅ Avoid adding duplicate if chat already exists
            set((state) => {
                const exists = state.chats.some(c => c._id === newChat._id);
                return {
                    selectedChat: newChat,
                    chats: exists ? state.chats : [...state.chats, newChat],
                };
            });

            return newChat; // ✅ Return so caller can navigate
        } catch (error) {
            console.error("Failed to create chat:", error);
        }
    },

    getChats: async () => {
        set({ isChatsLoading: true });
        try {
            const res = await fetchChatsApi();
            set({ chats: res.data, isChatsLoading: false });
        } catch (error) {
            console.error("Failed to fetch chats:", error);
            set({ isChatsLoading: false });
        }
    },

    getMessages: async (chatId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await fetchMessagesApi(chatId);
            set({ messages: res.data, isMessagesLoading: false });
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            set({ isMessagesLoading: false });
        }
    },

    getChatById: async (chatId) => {
        try {
            const res = await fetchChatByIdApi(chatId);
            set({ selectedChat: res.data });
        } catch (error) {
            console.error("Failed to fetch chat by ID:", error);
        }
    },

    sendMessage: async (content, chatId) => {
        try {
            const res = await sendMessageApi(content, chatId);
            const newMessage = res.data;
            
            set((state) => {
                const isDuplicate = state.messages.some(m => m._id === newMessage._id);
                if (isDuplicate) return state;
                return { messages: [...state.messages, newMessage] };
            });

            return newMessage;
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    },

    // Handle incoming messages from socket
    subscribeToMessages: () => {
        const socket = getSocket();
        if (!socket) return;

        // ✅ Remove any existing listener before adding a new one
        socket.off("message received");

        socket.on("message received", (newMessage) => {
            const { selectedChat } = get();
            
            // Only update messages if it's the currently selected chat
            if (selectedChat && selectedChat._id === newMessage.chatId._id) {
                set((state) => {
                    const isDuplicate = state.messages.some(m => m._id === newMessage._id);
                    if (isDuplicate) return state;
                    return { messages: [...state.messages, newMessage] };
                });
            }
            // ✅ Update lastMessage locally instead of re-fetching all chats
            set((state) => ({
                chats: state.chats.map((chat) =>
                    chat._id === newMessage.chatId._id
                        ? { ...chat, lastMessage: newMessage }
                        : chat
                ),
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("message received");
        }
    }
}));

export default useChatStore;

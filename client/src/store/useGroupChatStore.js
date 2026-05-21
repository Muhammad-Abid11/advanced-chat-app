import { create } from "zustand";
import {
    createGroupChatApi,
    renameGroupApi,
    addToGroupApi,
    removeFromGroupApi
} from "../api/chat/groupChat.api";
import useChatStore from "./useChatStore";

const useGroupChatStore = create(() => ({
    createGroupChat: async (name, users) => {
        try {
            const res = await createGroupChatApi(name, users);
            const newChat = res.data;
            useChatStore.setState((state) => ({
                selectedChat: newChat,
                chats: [newChat, ...state.chats],
            }));
            return newChat;
        } catch (error) {
            console.error("Failed to create group chat:", error);
        }
    },

    renameGroup: async (chatId, chatName) => {
        try {
            const res = await renameGroupApi(chatId, chatName);
            const updatedChat = res.data;
            useChatStore.setState((state) => ({
                selectedChat: updatedChat,
                chats: state.chats.map((c) => c._id === chatId ? updatedChat : c),
            }));
            return updatedChat;
        } catch (error) {
            console.error("Failed to rename group:", error);
        }
    },

    addToGroup: async (chatId, userId) => {
        try {
            const res = await addToGroupApi(chatId, userId);
            const updatedChat = res.data;
            useChatStore.setState((state) => ({
                selectedChat: updatedChat,
                chats: state.chats.map((c) => c._id === chatId ? updatedChat : c),
            }));
            return updatedChat;
        } catch (error) {
            console.error("Failed to add user to group:", error);
        }
    },

    removeFromGroup: async (chatId, userId, currentUserId) => {
        try {
            const res = await removeFromGroupApi(chatId, userId);
            const data = res.data;
            
            if (data.chatDeleted || userId === currentUserId) {
                useChatStore.setState((state) => ({
                    selectedChat: state.selectedChat?._id === chatId ? null : state.selectedChat,
                    chats: state.chats.filter((c) => c._id !== chatId),
                }));
            } else {
                const updatedChat = data;
                useChatStore.setState((state) => ({
                    selectedChat: state.selectedChat?._id === chatId ? updatedChat : state.selectedChat,
                    chats: state.chats.map((c) => c._id === chatId ? updatedChat : c),
                }));
            }
        } catch (error) {
            console.error("Failed to remove user from group:", error);
        }
    }
}));

export default useGroupChatStore;

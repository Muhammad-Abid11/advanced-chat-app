import { io } from "socket.io-client";

let socket = null;

// 🔌 Connect socket
export const connectWebSocket = (token) => {
    if (socket) return socket;
    socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
        auth: {
            token,
        },
        transports: ["websocket"], // better performance
    });

    // ✅ Connection events
    socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔴 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket error:", err.message);
    });

    return socket;
};

// 📡 Get existing socket
export const getSocket = () => socket;

// ❌ Disconnect socket
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};


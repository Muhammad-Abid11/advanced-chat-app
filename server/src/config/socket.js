import { Server } from "socket.io";
import { isTokenValid } from "../utils/generateToken.js";

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        },
    });

    // Middleware to verify token from handshake
    // Authenticate Socket connection by token
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = isTokenValid(token);
            socket.user = decoded; // Attach user info to socket
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // Automatically join the user to their own private room using user_id from token
        if (socket.user && socket.user.user_id) {
            socket.join(socket.user.user_id);
            socket.emit("connected");
            console.log(`👤 User joined private room: ${socket.user.user_id}`);
        }

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log(`💬 User joined chat room: ${room}`);
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket not initialized");
    return io;
};

export {
    initSocket,
    getIO
}
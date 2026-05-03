import { Server } from "socket.io";

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

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
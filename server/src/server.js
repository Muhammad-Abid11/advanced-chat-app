/*
import dotenv from "dotenv";
dotenv.config();
*/
import "dotenv/config"; // This automatically runs dotenv.config() behind the scenes.

import http from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import connectDB from "./config/db.js";

const server = http.createServer(app);

// socket init
initSocket(server);

// DB connect
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
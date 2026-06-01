import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import groupChatRoutes from "./modules/groupChat/groupChat.routes.js";
import { FRONTEND_URL } from "./constants/env.constant.js";
import path from "path";
import { fileURLToPath } from 'url';

// In ES Modules (import), Node doesn't automatically provide __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(
    {
        origin: FRONTEND_URL,
        credentials: true,
    }
));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/group", groupChatRoutes);

// this route serves the files in the uploads directory statically, making them accessible via URL.
// For example, if you have a file at .../server/uploads/123.png, you can access it at: http://localhost:3000/uploads/123.png
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

export default app;
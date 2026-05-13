import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

export default app;
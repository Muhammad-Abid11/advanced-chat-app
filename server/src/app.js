import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

export default app;
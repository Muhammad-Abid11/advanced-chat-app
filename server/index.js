import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(morgan("tiny"));
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

app.use(express.json()); //middleware


// Root route
app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
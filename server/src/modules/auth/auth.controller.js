import { createJWT } from "../../utils/generateToken.js";
import User from "./auth.model.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save user
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = createJWT(newUser);

        // remove password safely using destructuring assignment
        const { password: _, ...safeUser } = newUser.toObject();

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: safeUser,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user || !email || !password) {
            return res.status(401).json({ message: "User not found or invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = createJWT(user);

        // remove password safely using destructuring assignment
        const { password: _, ...safeUser } = user.toObject();
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: safeUser,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET CURRENT USER
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select("-password");
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { registerUser, loginUser, logoutUser, getCurrentUser }
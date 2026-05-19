import { REFRESH_TOKEN_SECRET } from "../../constants/env.constant.js";
import { clearTokenCookies, setTokenCookies } from "../../utils/cookie.util.js";
import { createAccessToken, createRefreshToken, isTokenValid } from "../../utils/generateToken.js";
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
        // generate tokens
        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);

        // remove password safely using destructuring assignment
        const { password: _, ...safeUser } = newUser.toObject();

        // ✅ Add httpOnly: true
        // set cookies
        setTokenCookies(res, accessToken, refreshToken);
        return res.status(201).json({
            message: "User registered successfully",
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

        // generate tokens
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        // remove password safely using destructuring assignment
        const { password: _, ...safeUser } = user.toObject();

        // ✅ Add httpOnly: true ( when you don't have cookie.util.js file)
        /*
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        */

        // set cookies
        setTokenCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        clearTokenCookies(res);
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

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        const decoded = isTokenValid(refreshToken, REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const accessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        setTokenCookies(res, accessToken, newRefreshToken);

        res.status(200).json({ message: "Token refreshed successfully" });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
}

export { registerUser, loginUser, logoutUser, getCurrentUser, refreshToken }
import express from "express";
import { verifyToken } from "../../utils/generateToken.js";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshToken } from "./auth.controller.js"

const router = express.Router();

router.route('/').get((req, res) => {
    res.json({ message: 'Auth routes' })
})
router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/me").get(verifyToken, getCurrentUser);
router.route("/refresh").post(refreshToken);

export default router;
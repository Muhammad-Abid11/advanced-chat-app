import express from "express";
import { verifyToken } from "../../utils/generateToken.js";
import { getAllUsers, getUserById } from "./users.controller.js"

const router = express.Router();

router.route('/').get(verifyToken, getAllUsers);
router.route("/:id").get(verifyToken, getUserById);

export default router;
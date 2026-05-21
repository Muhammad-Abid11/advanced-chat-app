import express from "express";
import { verifyToken } from "../../utils/generateToken.js";
import {
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
} from "./groupChat.controller.js";

const router = express.Router();

router.route("/").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/add").put(verifyToken, addToGroup);
router.route("/remove").put(verifyToken, removeFromGroup);

export default router;

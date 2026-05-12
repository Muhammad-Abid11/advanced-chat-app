import express from "express";
import { verifyToken } from "../../utils/generateToken.js";
import { createChat, getAllChatsLastMessage, getChatById } from "./chat.controller.js";
import { sendMessage, allMessages } from "./message.controller.js";

const router = express.Router();

router.route("/").get(verifyToken, getAllChatsLastMessage).post(verifyToken, createChat);

router.route("/messages").post(verifyToken, sendMessage);
router.route("/messages/:chatId").get(verifyToken, allMessages);

// dynamic param route must be last, if you placed "/:chatId" before "/messages"(get service), express treats as: req.params.chatId = "messages"
router.route("/:chatId").get(verifyToken, getChatById);

export default router;

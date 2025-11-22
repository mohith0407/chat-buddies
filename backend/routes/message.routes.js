import express from "express";
import {
  allMessages,
  deleteMessage,
  deleteMultipleMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/delete/:messageId").delete(protect, deleteMessage); // Single
router.route("/delete/bulk").put(protect, deleteMultipleMessages);
export default router;
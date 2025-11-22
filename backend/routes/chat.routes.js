import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  updateGroupIcon,
  deleteGroup,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";


const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/group/icon").put(protect, upload.single("groupAvatar"), updateGroupIcon);
router.route("/group/delete").delete(protect, deleteGroup);

export default router;
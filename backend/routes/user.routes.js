import express from "express"
import { registerUser,authUser,allUsers, updateUserProfile, updatePassword, deleteUserAccount } from "../controllers/user.controller.js"
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";
const router=express.Router()

router.post("/", upload.single("avatar"), registerUser);
router.post("/login",authUser)

// protected

router.route("/").get(protect, allUsers);
router.route("/profile").put(protect, upload.single("avatar"), updateUserProfile);
router.route("/password").put(protect, updatePassword);
router.route("/delete").delete(protect, deleteUserAccount);
export default router
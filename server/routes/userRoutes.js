import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../controllers/userController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", allowRoles("SuperAdmin"), createUser);
router.get("/", allowRoles("SuperAdmin"), getAllUsers);
router.get("/:id", allowRoles("SuperAdmin"), getUserById);
router.put("/:id", allowRoles("SuperAdmin"), updateUser);
router.delete("/:id", allowRoles("SuperAdmin"), deleteUser);
router.patch("/:id/toggle-status", allowRoles("SuperAdmin"), toggleUserStatus);

export default router;
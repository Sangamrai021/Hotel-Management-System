import express from "express";
import {
  collectPayment,
  getAllPayments,
  getPaymentById,
  getPaymentSummary,
} from "../controllers/paymentController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Only SuperAdmin, Manager, Receptionist can collect payment
router.post("/collect", allowRoles("SuperAdmin", "Manager", "Receptionist"), collectPayment);

// All roles can view payments
router.get("/", getAllPayments);
router.get("/summary", getPaymentSummary);
router.get("/:id", getPaymentById);

export default router;
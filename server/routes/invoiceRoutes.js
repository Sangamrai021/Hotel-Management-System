import express from "express";
import {
  generateInvoice,
  getInvoiceByBooking,
  getAllInvoices,
} from "../controllers/invoiceController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
// GET routes — all roles
// POST route — not Accountant
router.post("/booking/:bookingId", allowRoles("SuperAdmin", "Manager", "Receptionist"), generateInvoice);
router.get("/booking/:bookingId", getInvoiceByBooking);
router.get("/", getAllInvoices);

export default router;
import express from "express";
import {
  generateInvoice,
  getInvoiceByBooking,
  getAllInvoices,
} from "../controllers/invoiceController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/booking/:bookingId", generateInvoice);
router.get("/booking/:bookingId", getInvoiceByBooking);
router.get("/", getAllInvoices);

export default router;
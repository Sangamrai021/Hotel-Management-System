import express from "express";
import Payment from "../models/Payment.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", allowRoles("SuperAdmin", "Manager"), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("invoice")
      .populate("booking")
      .populate("hotel")
      .populate("collectedBy", "name email role");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("invoice")
      .populate("booking")
      .populate("hotel")
      .populate("collectedBy", "name email role");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment", error: error.message });
  }
});

router.post("/", allowRoles("SuperAdmin", "Manager", "Receptionist"), async (req, res) => {
  try {
    const { invoice: invoiceId, booking: bookingId, amount, method, transactionId, status, paidAt } = req.body;

    if (!invoiceId || !bookingId || amount == null || !method) {
      return res.status(400).json({
        message: "Invoice, booking, amount and method are required",
      });
    }

    const invoice = await Payment.db.model("Invoice").findById(invoiceId);
    const booking = await Payment.db.model("Booking").findById(bookingId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (invoice.booking.toString() !== booking._id.toString()) {
      return res.status(400).json({ message: "Invoice does not belong to the selected booking" });
    }

    const payment = await Payment.create({
      invoice: invoiceId,
      booking: bookingId,
      hotel: booking.hotel,
      amount,
      method,
      transactionId,
      status,
      paidAt,
      collectedBy: req.user._id,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: "Failed to create payment", error: error.message });
  }
});

export default router;
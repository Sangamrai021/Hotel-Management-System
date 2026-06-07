import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";

export const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("guest")
      .populate("room");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const existing = await Invoice.findOne({ booking: booking._id });
    if (existing)
      return res.status(400).json({
        message: "Invoice already generated for this booking",
        invoice: existing,
      });

    if (booking.status === "Cancelled")
      return res.status(400).json({ message: "Cannot generate invoice for a cancelled booking" });

    const invoice = await Invoice.create({
      booking: booking._id,
      guest: booking.guest._id,
      room: booking.room._id,
      guestName: booking.guest.name,
      roomNumber: booking.room.roomNumber,
      roomType: booking.room.roomType,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      days: booking.days,
      pricePerNight: booking.pricePerNight,
      totalAmount: booking.totalAmount,
      invoiceDate: new Date(),
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceByBooking = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ booking: req.params.bookingId });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("guest", "name email")
      .populate("room", "roomNumber roomType")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
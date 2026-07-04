import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";

export const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("guest")
      .populate("room");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "SuperAdmin" &&
      booking.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const existing = await Invoice.findOne({ booking: booking._id });
    if (existing)
      return res.status(400).json({
        message: "Invoice already generated for this booking",
        invoice: existing,
      });

    if (booking.status === "Cancelled")
      return res.status(400).json({ message: "Cannot generate invoice for a cancelled booking" });

    const invoice = await Invoice.create({
      hotel: booking.hotel,
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
      paymentStatus: "Pending",
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceByBooking = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ booking: req.params.bookingId })
      .populate("hotel", "name city address phone email");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (req.user.role !== "SuperAdmin" &&
      invoice.hotel._id.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const { paymentStatus, page = 1, limit = 10 } = req.query;

    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId
      : req.user.hotel;

    const filter = {};
    if (hotelId) filter.hotel = hotelId;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const total = await Invoice.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const invoices = await Invoice.find(filter)
      .populate("guest", "name email")
      .populate("room", "roomNumber roomType")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ invoices, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
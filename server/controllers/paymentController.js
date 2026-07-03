import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";

export const collectPayment = async (req, res) => {
  try {
    const { invoiceId, method, transactionId } = req.body;

    // Validate method
    if (!["Cash", "Khalti", "eSewa"].includes(method))
      return res.status(400).json({ message: "Payment method must be Cash, Khalti or eSewa" });

    // Khalti and eSewa require transaction ID
    if (method !== "Cash" && !transactionId)
      return res.status(400).json({ message: "Transaction ID is required for digital payments" });

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    // Check hotel access
    if (req.user.role !== "SuperAdmin" &&
      invoice.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    // Check if already paid
    if (invoice.paymentStatus === "Paid")
      return res.status(400).json({ message: "Invoice is already paid" });

    // Get booking
    const booking = await Booking.findById(invoice.booking);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // Create payment record
    const payment = await Payment.create({
      invoice: invoice._id,
      booking: booking._id,
      hotel: invoice.hotel,
      amount: invoice.totalAmount,
      method,
      status: "Paid",
      transactionId: transactionId || null,
      collectedBy: req.user._id,
      paidAt: new Date(),
    });

    // Update invoice payment status
    invoice.paymentStatus = "Paid";
    invoice.paymentMethod = method;
    invoice.transactionId = transactionId || null;
    invoice.paidAt = new Date();
    invoice.collectedBy = req.user._id;
    await invoice.save();

    const populated = await Payment.findById(payment._id)
      .populate("invoice", "guestName roomNumber totalAmount")
      .populate("collectedBy", "name role");

    res.status(201).json({
      message: "Payment collected successfully",
      payment: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { method, status, page = 1, limit = 10 } = req.query;

    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId || null
      : req.user.hotel;

    const filter = {};
    if (hotelId) filter.hotel = hotelId;
    if (method) filter.method = method;
    if (status) filter.status = status;

    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const payments = await Payment.find(filter)
      .populate("invoice", "guestName roomNumber totalAmount invoiceDate")
      .populate("booking", "checkIn checkOut status")
      .populate("collectedBy", "name role")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ payments, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("invoice", "guestName roomNumber totalAmount invoiceDate paymentStatus")
      .populate("booking", "checkIn checkOut status days")
      .populate("collectedBy", "name role")
      .populate("hotel", "name city address phone email");

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (req.user.role !== "SuperAdmin" &&
      payment.hotel._id.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentSummary = async (req, res) => {
  try {
    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId || null
      : req.user.hotel;

    const filter = hotelId ? { hotel: hotelId } : {};

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total revenue this month
    const monthlyRevenue = await Payment.aggregate([
      { $match: { ...filter, status: "Paid", paidAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Today's collections
    const todayRevenue = await Payment.aggregate([
      { $match: { ...filter, status: "Paid", paidAt: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Payment method breakdown
    const methodBreakdown = await Payment.aggregate([
      { $match: { ...filter, status: "Paid", paidAt: { $gte: monthStart } } },
      { $group: { _id: "$method", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      ...filter,
      paymentStatus: "Pending",
    });

    const pendingAmount = await Invoice.aggregate([
      { $match: { ...filter, paymentStatus: "Pending" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Today's payment count
    const todayPaymentCount = await Payment.countDocuments({
      ...filter,
      paidAt: { $gte: todayStart, $lte: todayEnd },
    });

    res.json({
      revenueThisMonth: monthlyRevenue[0]?.total || 0,
      revenueToday: todayRevenue[0]?.total || 0,
      todayPaymentCount,
      methodBreakdown,
      pendingInvoices,
      pendingAmount: pendingAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
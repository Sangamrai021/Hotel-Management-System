import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import Booking from "../models/Booking.js";
import Invoice from "../models/Invoice.js";

export const getDashboardStats = async (req, res) => {
  try {
    // SuperAdmin sees all or filtered by hotelId
    // Others see only their hotel
    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId || null
      : req.user.hotel;

    const filter = hotelId ? { hotel: hotelId } : {};

    const totalRooms = await Room.countDocuments(filter);
    const occupiedRooms = await Room.countDocuments({ ...filter, status: "Occupied" });
    const availableRooms = totalRooms - occupiedRooms;
    const totalGuests = await Guest.countDocuments(filter);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bookingsToday = await Booking.countDocuments({
      ...filter,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const revenueResult = await Invoice.aggregate([
      { $match: { ...filter, invoiceDate: { $gte: monthStart }, paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenueThisMonth = revenueResult[0]?.total || 0;

    const pendingPayments = await Invoice.countDocuments({
      ...filter,
      paymentStatus: "Pending",
    });

    res.json({
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalGuests,
      bookingsToday,
      revenueThisMonth,
      pendingPayments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
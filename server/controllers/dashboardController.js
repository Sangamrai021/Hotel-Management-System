import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import Booking from "../models/Booking.js";
import Invoice from "../models/Invoice.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: "Occupied" });
    const availableRooms = totalRooms - occupiedRooms;
    const totalGuests = await Guest.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const revenueResult = await Invoice.aggregate([
      { $match: { invoiceDate: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenueThisMonth = revenueResult[0]?.total || 0;

    res.json({
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalGuests,
      bookingsToday,
      revenueThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
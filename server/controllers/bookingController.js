import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";

const isRoomAvailable = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    room: roomId,
    status: { $in: ["Booked", "CheckedIn"] },
    $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  const conflict = await Booking.findOne(query);
  return !conflict;
};

export const createBooking = async (req, res) => {
  try {
    const { guest, room, checkIn, checkOut } = req.body;

    const guestDoc = await Guest.findById(guest);
    if (!guestDoc) return res.status(404).json({ message: "Guest not found" });

    const roomDoc = await Room.findById(room);
    if (!roomDoc) return res.status(404).json({ message: "Room not found" });

    let hotelId;
    if (req.user.role === "SuperAdmin") {
      if (guestDoc.hotel.toString() !== roomDoc.hotel.toString())
        return res.status(400).json({ message: "Guest and room must belong to the same hotel" });
      hotelId = roomDoc.hotel;
    } else {
      hotelId = req.user.hotel;
      if (!hotelId)
        return res.status(400).json({ message: "No hotel assigned to your account" });
      if (guestDoc.hotel.toString() !== hotelId.toString())
        return res.status(400).json({ message: "Guest does not belong to your hotel" });
      if (roomDoc.hotel.toString() !== hotelId.toString())
        return res.status(400).json({ message: "Room does not belong to your hotel" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate)
      return res.status(400).json({ message: "Check-out date must be after check-in date" });

    const available = await isRoomAvailable(room, checkInDate, checkOutDate);
    if (!available)
      return res.status(400).json({ message: "Room is already booked for the selected dates" });

    const booking = await Booking.create({
      hotel: hotelId,
      guest,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      pricePerNight: roomDoc.pricePerNight,
      status: "Booked",
    });

    roomDoc.status = "Occupied";
    await roomDoc.save();

    const populated = await Booking.findById(booking._id)
      .populate("guest", "name email phone")
      .populate("room", "roomNumber roomType pricePerNight")
      .populate("hotel", "name city");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId
      : req.user.hotel;

    const filter = {};
    if (hotelId) filter.hotel = hotelId;
    if (status) filter.status = status;

    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const bookings = await Booking.find(filter)
      .populate("guest", "name email phone")
      .populate("room", "roomNumber roomType pricePerNight")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ bookings, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("guest", "name email phone address idProof idNumber")
      .populate("room", "roomNumber roomType pricePerNight")
      .populate("hotel", "name city");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "SuperAdmin" &&
      booking.hotel._id.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validTransitions = {
      Booked: ["CheckedIn", "Cancelled"],
      CheckedIn: ["CheckedOut"],
      CheckedOut: [],
      Cancelled: [],
    };

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "SuperAdmin" &&
      booking.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const allowed = validTransitions[booking.status];
    if (!allowed.includes(status))
      return res.status(400).json({
        message: `Cannot change status from ${booking.status} to ${status}`,
      });

    booking.status = status;
    await booking.save();

    const room = await Room.findById(booking.room);
    if (room) {
      if (status === "CheckedOut" || status === "Cancelled") {
        room.status = "Available";
      } else if (status === "CheckedIn") {
        room.status = "Occupied";
      }
      await room.save();
    }

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "SuperAdmin" &&
      booking.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    if (booking.status === "CheckedIn")
      return res.status(400).json({ message: "Cannot delete an active check-in" });

    if (booking.status === "Booked") {
      const room = await Room.findById(booking.room);
      if (room) { room.status = "Available"; await room.save(); }
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    if (!roomId || !checkIn || !checkOut)
      return res.status(400).json({ message: "roomId, checkIn and checkOut are required" });

    const available = await isRoomAvailable(roomId, new Date(checkIn), new Date(checkOut));
    res.json({ available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
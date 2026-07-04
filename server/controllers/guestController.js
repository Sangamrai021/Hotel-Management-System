import Guest from "../models/Guest.js";
import Booking from "../models/Booking.js";

export const createGuest = async (req, res) => {
  try {
    const { name, email, phone, address, idProof, idNumber } = req.body;

    const hotelId = req.user.hotel;
    if (!hotelId)
      return res.status(400).json({ message: "No hotel assigned to your account" });

    if (!/^[a-zA-Z\s]+$/.test(name))
      return res.status(400).json({ message: "Name can only contain letters and spaces" });

    if (!/^[^\s@]+@[^\s@]{4,}\.[^\s@]{2,}$/.test(email))
      return res.status(400).json({ message: "Please enter a valid email address" });

    if (!/^(97|98)[0-9]{8}$/.test(phone))
      return res.status(400).json({ message: "Phone number must start with 97 or 98 and be exactly 10 digits" });

    if (!/^[0-9]+$/.test(idNumber))
      return res.status(400).json({ message: "ID number must contain numbers only" });

    // Email unique within same hotel
    const exists = await Guest.findOne({ email, hotel: hotelId });
    if (exists)
      return res.status(400).json({ message: "Guest with this email already exists in your hotel" });

    const guest = await Guest.create({
      hotel: hotelId,
      name,
      email,
      phone,
      address,
      idProof,
      idNumber,
    });

    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGuests = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId
      : req.user.hotel;

    const filter = {};
    if (hotelId) filter.hotel = hotelId;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Guest.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const guests = await Guest.find(filter)
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ guests, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id).populate("hotel", "name city");
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    if (req.user.role !== "SuperAdmin" &&
      guest.hotel._id.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    if (req.user.role !== "SuperAdmin" &&
      guest.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const { name, email, phone, idNumber } = req.body;

    if (name && !/^[a-zA-Z\s]+$/.test(name))
      return res.status(400).json({ message: "Name can only contain letters and spaces" });

    if (email && !/^[^\s@]+@[^\s@]{4,}\.[^\s@]{2,}$/.test(email))
      return res.status(400).json({ message: "Please enter a valid email address" });

    if (phone && !/^(97|98)[0-9]{8}$/.test(phone))
      return res.status(400).json({ message: "Phone must start with 97 or 98 and be 10 digits" });

    if (idNumber && !/^[0-9]+$/.test(idNumber))
      return res.status(400).json({ message: "ID number must contain numbers only" });

    if (email && email !== guest.email) {
      const exists = await Guest.findOne({ email, hotel: guest.hotel });
      if (exists)
        return res.status(400).json({ message: "Email already in use by another guest" });
    }

    const updated = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("hotel", "name city");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    if (req.user.role !== "SuperAdmin" &&
      guest.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const activeBooking = await Booking.findOne({
      guest: req.params.id,
      status: { $in: ["Booked", "CheckedIn"] },
    });
    if (activeBooking)
      return res.status(400).json({ message: "Cannot delete guest with active bookings" });

    await guest.deleteOne();
    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuestBookingHistory = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    if (req.user.role !== "SuperAdmin" &&
      guest.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const bookings = await Booking.find({ guest: req.params.id })
      .populate("room", "roomNumber roomType pricePerNight")
      .sort({ createdAt: -1 });

    res.json({ guest, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
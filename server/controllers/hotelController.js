import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res) => {
  try {
    const { name, address, city, phone, email } = req.body;

    const exists = await Hotel.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Hotel with this email already exists" });

    const hotel = await Hotel.create({ name, address, city, phone, email });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHotels = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Hotel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const hotels = await Hotel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Add staff count and room count per hotel
    const hotelsWithStats = await Promise.all(
      hotels.map(async (hotel) => {
        const staffCount = await User.countDocuments({ hotel: hotel._id });
        const roomCount = await Room.countDocuments({ hotel: hotel._id });
        return { ...hotel.toObject(), staffCount, roomCount };
      })
    );

    res.json({ hotels: hotelsWithStats, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const staffCount = await User.countDocuments({ hotel: hotel._id });
    const roomCount = await Room.countDocuments({ hotel: hotel._id });

    res.json({ ...hotel.toObject(), staffCount, roomCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const { email } = req.body;
    if (email && email !== hotel.email) {
      const exists = await Hotel.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already in use by another hotel" });
    }

    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Check if hotel has active staff
    const staffCount = await User.countDocuments({ hotel: hotel._id });
    if (staffCount > 0)
      return res.status(400).json({
        message: `Cannot delete hotel with ${staffCount} active staff. Remove staff first.`,
      });

    await hotel.deleteOne();
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
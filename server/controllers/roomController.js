import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, pricePerNight, description } = req.body;

    // Get hotel from logged in user
    const hotelId = req.user.hotel;
    if (!hotelId)
      return res.status(400).json({ message: "No hotel assigned to your account" });

    // Validate room number format
    if (!/^(?=.*[0-9])[a-zA-Z0-9-]+$/.test(roomNumber))
      return res.status(400).json({ message: "Room number must contain at least one number" });

    // Check duplicate room number within same hotel only
    const exists = await Room.findOne({ roomNumber, hotel: hotelId });
    if (exists)
      return res.status(400).json({ message: "Room number already exists in your hotel" });

    const room = await Room.create({
      hotel: hotelId,
      roomNumber,
      roomType,
      pricePerNight,
      description,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { search, roomType, status, page = 1, limit = 10 } = req.query;

    // SuperAdmin can pass hotelId in query, others use their own hotel
    const hotelId = req.user.role === "SuperAdmin"
      ? req.query.hotelId
      : req.user.hotel;

    const filter = {};
    if (hotelId) filter.hotel = hotelId;
    if (search) filter.roomNumber = { $regex: search, $options: "i" };
    if (roomType) filter.roomType = roomType;
    if (status) filter.status = status;

    const total = await Room.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const rooms = await Room.find(filter)
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ rooms, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name city");
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Non SuperAdmin can only see their hotel's rooms
    if (req.user.role !== "SuperAdmin" &&
      room.hotel._id.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Check hotel ownership
    if (req.user.role !== "SuperAdmin" &&
      room.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    const { roomNumber } = req.body;

    if (roomNumber && !/^(?=.*[0-9])[a-zA-Z0-9-]+$/.test(roomNumber))
      return res.status(400).json({ message: "Room number must contain at least one number" });

    if (roomNumber && roomNumber !== room.roomNumber) {
      const exists = await Room.findOne({ roomNumber, hotel: room.hotel });
      if (exists)
        return res.status(400).json({ message: "Room number already exists in this hotel" });
    }

    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("hotel", "name city");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Check hotel ownership
    if (req.user.role !== "SuperAdmin" &&
      room.hotel.toString() !== req.user.hotel.toString())
      return res.status(403).json({ message: "Access denied" });

    if (room.status === "Occupied")
      return res.status(400).json({ message: "Cannot delete an occupied room" });

    await room.deleteOne();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, pricePerNight, description, hotel: hotelId } = req.body;
    const hotel = req.user.role === "SuperAdmin" ? hotelId || req.user.hotel : req.user.hotel;

    if (!hotel) {
      return res.status(400).json({ message: "Hotel is required" });
    }

    if (!roomNumber || !roomType || pricePerNight == null) {
      return res.status(400).json({
        message: "Room number, room type and price per night are required",
      });
    }

    // Validate room number format
    if (!/^[a-zA-Z0-9-]+$/.test(roomNumber)) {
      return res.status(400).json({ message: "Room number can only contain letters, numbers and hyphens" });
    }

    const exists = await Room.findOne({ roomNumber });
    if (exists)
      return res.status(400).json({ message: "Room number already exists" });

    const room = await Room.create({ roomNumber, roomType, pricePerNight, description, hotel });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { search, roomType, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) filter.roomNumber = { $regex: search, $options: "i" };
    if (roomType) filter.roomType = roomType;
    if (status) filter.status = status;

    const total = await Room.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const rooms = await Room.find(filter)
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
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const { roomNumber, roomType, pricePerNight, description, status } = req.body;

    if (roomNumber && !/^(?=.*[0-9])[a-zA-Z0-9-]+$/.test(roomNumber)) {
      return res.status(400).json({ message: "Room number must contain at least one number" });
    }

    if (roomNumber && roomNumber !== room.roomNumber) {
      const exists = await Room.findOne({ roomNumber });
      if (exists)
        return res.status(400).json({ message: "Room number already exists" });
    }

    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      { roomNumber, roomType, pricePerNight, description, status },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.status === "Occupied")
      return res.status(400).json({ message: "Cannot delete an occupied room" });

    await room.deleteOne();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
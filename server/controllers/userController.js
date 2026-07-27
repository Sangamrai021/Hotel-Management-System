import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, hotel, phone } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Name, email, password and role are required" });

    if (role !== "SuperAdmin" && !hotel)
      return res.status(400).json({ message: "Hotel assignment is required for this role" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User with this email already exists" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      hotel: role === "SuperAdmin" ? null : hotel,
      phone: phone || "",
      isActive: true,
    });

    const populated = await User.findById(user._id)
      .select("-password")
      .populate("hotel", "name city");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, hotel, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (hotel) filter.hotel = hotel;

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const users = await User.find(filter)
      .select("-password")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("hotel", "name city");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email, password, role, hotel } = req.body;

    if (user.role === "SuperAdmin" && role && role !== "SuperAdmin")
      return res.status(403).json({ message: "Cannot change role of a Super Admin" });

    if (user.role === "SuperAdmin" && req.body.isActive === false)
      return res.status(403).json({ message: "Super Admin accounts cannot be deactivated" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already in use by another user" });
    }

    // Hash new password if provided
    if (password) {
      if (password.length < 8)
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      req.body.password = await bcrypt.hash(password, 10);
    } else {
      delete req.body.password;
    }

    // SuperAdmin has no hotel
    if (role === "SuperAdmin") req.body.hotel = null;

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("hotel", "name city");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot delete your own account" });

    if (user.role === "SuperAdmin")
      return res.status(403).json({ message: "Super Admin accounts cannot be deleted" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot deactivate your own account" });

    if (user.role === "SuperAdmin")
      return res.status(403).json({ message: "Super Admin accounts cannot be deactivated" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
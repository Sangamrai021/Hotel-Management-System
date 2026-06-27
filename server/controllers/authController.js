import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user by email
    const user = await User.findOne({ email }).populate("hotel", "name city address");
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // Check if account is active
    if (!user.isActive)
      return res.status(401).json({ message: "Your account has been deactivated. Contact Super Admin." });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hotel: user.hotel,
        phone: user.phone,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("hotel", "name city address phone email");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (name && !/^[a-zA-Z\s]+$/.test(name))
      return res.status(400).json({ message: "Name can only contain letters and spaces" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both current and new password are required" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
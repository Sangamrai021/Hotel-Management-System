import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);

// Clear existing users and hotels
await User.deleteMany({});
await Hotel.deleteMany({});
console.log("Cleared existing users and hotels");

// Create hotels first
const hotels = await Hotel.insertMany([
  {
    name: "Hotel Himalaya",
    address: "Thamel, Kathmandu",
    city: "Kathmandu",
    phone: "9800000001",
    email: "himalaya@hotel.com",
  },
  {
    name: "Hotel Summit",
    address: "Lakeside, Pokhara",
    city: "Pokhara",
    phone: "9800000002",
    email: "summit@hotel.com",
  },
]);

console.log("2 Hotels created");

const himalaya = hotels[0]._id;
const summit = hotels[1]._id;

// Create users
const users = [
  {
    name: "Super Admin",
    email: "superadmin@hotel.com",
    password: await bcrypt.hash("admin123", 10),
    role: "SuperAdmin",
    hotel: null,
    isActive: true,
  },
  {
    name: "Ram Sharma",
    email: "manager@hotel.com",
    password: await bcrypt.hash("manager123", 10),
    role: "Manager",
    hotel: himalaya,
    isActive: true,
  },
  {
    name: "Sita Thapa",
    email: "reception@hotel.com",
    password: await bcrypt.hash("reception123", 10),
    role: "Receptionist",
    hotel: himalaya,
    isActive: true,
  },
  {
    name: "Hari Poudel",
    email: "accounts@hotel.com",
    password: await bcrypt.hash("accounts123", 10),
    role: "Accountant",
    hotel: himalaya,
    isActive: true,
  },
];

await User.insertMany(users);
console.log("4 Users created");
console.log("");
console.log("Login Credentials:");
console.log("SuperAdmin   → superadmin@hotel.com / admin123");
console.log("Manager      → manager@hotel.com / manager123");
console.log("Receptionist → reception@hotel.com / reception123");
console.log("Accountant   → accounts@hotel.com / accounts123");

process.exit();
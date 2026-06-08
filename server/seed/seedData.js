import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);

// Clear existing rooms and guests
await Room.deleteMany({});
await Guest.deleteMany({});
console.log("🗑️  Cleared existing rooms and guests");

// Seed Rooms
const rooms = [
  { roomNumber: "101", roomType: "Standard", pricePerNight: 3000, description: "Cozy standard room with city view" },
  { roomNumber: "102", roomType: "Standard", pricePerNight: 3000, description: "Standard room with garden view" },
  { roomNumber: "103", roomType: "Standard", pricePerNight: 2500, description: "Budget standard room" },
  { roomNumber: "201", roomType: "Deluxe", pricePerNight: 5000, description: "Spacious deluxe room with balcony" },
  { roomNumber: "202", roomType: "Deluxe", pricePerNight: 5500, description: "Deluxe room with mountain view" },
  { roomNumber: "203", roomType: "Deluxe", pricePerNight: 5000, description: "Deluxe room with king size bed" },
  { roomNumber: "204", roomType: "Deluxe", pricePerNight: 6000, description: "Deluxe corner room with two views" },
  { roomNumber: "301", roomType: "Suite", pricePerNight: 8000, description: "Luxury suite with living area" },
  { roomNumber: "302", roomType: "Suite", pricePerNight: 9000, description: "Presidential suite with jacuzzi" },
  { roomNumber: "303", roomType: "Suite", pricePerNight: 8500, description: "Suite with panoramic mountain view" },
];

await Room.insertMany(rooms);
console.log("10 Rooms created");

// Seed Guests
const guests = [
  { name: "Ram Sharma", email: "ram@gmail.com", phone: "9800000001", address: "Kathmandu", idProof: "Citizenship", idNumber: "1234567890" },
  { name: "Sita Thapa", email: "sita@gmail.com", phone: "9800000002", address: "Pokhara", idProof: "Citizenship", idNumber: "2345678901" },
  { name: "Hari Poudel", email: "hari@gmail.com", phone: "9700000003", address: "Lalitpur", idProof: "Passport", idNumber: "3456789012" },
  { name: "Gita Rai", email: "gita@gmail.com", phone: "9800000004", address: "Bhaktapur", idProof: "License", idNumber: "4567890123" },
  { name: "Bikash Karki", email: "bikash@gmail.com", phone: "9700000005", address: "Chitwan", idProof: "Citizenship", idNumber: "5678901234" },
  { name: "Anita Gurung", email: "anita@gmail.com", phone: "9800000006", address: "Pokhara", idProof: "Passport", idNumber: "6789012345" },
  { name: "Suresh Magar", email: "suresh@gmail.com", phone: "9700000007", address: "Kathmandu", idProof: "Citizenship", idNumber: "7890123456" },
  { name: "Kopila Tamang", email: "kopila@gmail.com", phone: "9800000008", address: "Lalitpur", idProof: "License", idNumber: "8901234567" },
  { name: "Dipak Shrestha", email: "dipak@gmail.com", phone: "9700000009", address: "Bhaktapur", idProof: "Citizenship", idNumber: "9012345678" },
  { name: "Manisha Bista", email: "manisha@gmail.com", phone: "9800000010", address: "Kathmandu", idProof: "Passport", idNumber: "9123456780" },
];

await Guest.insertMany(guests);
console.log("10 Guests created");

console.log("Seed data complete!");
process.exit();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);

const existing = await Admin.findOne({ email: "admin@gmail.com" });
if (existing) {
  console.log("Admin already exists. Skipping.");
  process.exit();
}

const hashedPassword = await bcrypt.hash("admin123", 10);
await Admin.create({
  email: "admin@gmail.com",
  password: hashedPassword,
});

console.log("Admin created: admin@gmail.com / admin123");
process.exit();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hotel Management API is running" });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    // Snapshots — frozen at invoice generation time
    guestName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    roomType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    days: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    invoiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
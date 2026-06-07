import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: [true, "Guest is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    days: {
      type: Number,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [1, "Price must be a positive number"],
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: {
        values: ["Booked", "CheckedIn", "CheckedOut", "Cancelled"],
        message: "Invalid booking status",
      },
      default: "Booked",
    },
  },
  { timestamps: true }
);

// Auto-calculate days and totalAmount before saving
bookingSchema.pre("save", function () {
  if (this.checkIn && this.checkOut) {
    const msPerDay = 1000 * 60 * 60 * 24;
    this.days = Math.ceil((this.checkOut - this.checkIn) / msPerDay);
    this.totalAmount = this.days * this.pricePerNight;
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
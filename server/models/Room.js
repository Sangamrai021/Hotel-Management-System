import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel is required"],
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
      match: [/^[A-Za-z0-9]+$/, "Room number can only contain letters and numbers"],
    },
    roomType: {
      type: String,
      required: [true, "Room type is required"],
      enum: {
        values: ["Standard", "Deluxe", "Suite"],
        message: "Room type must be Standard, Deluxe, or Suite",
      },
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [1, "Price must be a positive number"],
    },
    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
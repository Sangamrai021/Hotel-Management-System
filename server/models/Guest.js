import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]{4,}\.[^\s@]{2,}$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^(97|98)[0-9]{8}$/, "Phone number must start with 97 or 98 and be exactly 10 digits"],
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    idProof: {
      type: String,
      required: [true, "ID proof type is required"],
      enum: {
        values: ["Citizenship", "Passport", "License"],
        message: "ID proof must be Citizenship, Passport, or License",
      },
    },
    idNumber: {
      type: String,
      required: [true, "ID number is required"],
      trim: true,
      match: [/^[0-9]+$/, "ID number must contain numbers only"],
    },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;
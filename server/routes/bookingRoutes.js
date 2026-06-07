import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  checkRoomAvailability,
} from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/check-availability", checkRoomAvailability);
router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
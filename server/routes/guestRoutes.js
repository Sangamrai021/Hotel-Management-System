import express from "express";
import {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
  getGuestBookingHistory,
} from "../controllers/guestController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", createGuest);
router.get("/", getAllGuests);
router.get("/:id", getGuestById);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);
router.get("/:id/bookings", getGuestBookingHistory);

export default router;
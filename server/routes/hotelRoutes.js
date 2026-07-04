import express from "express";
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controllers/hotelController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", allowRoles("SuperAdmin"), createHotel);
router.get("/", allowRoles("SuperAdmin"), getAllHotels);
router.get("/:id", allowRoles("SuperAdmin"), getHotelById);
router.put("/:id", allowRoles("SuperAdmin"), updateHotel);
router.delete("/:id", allowRoles("SuperAdmin"), deleteHotel);

export default router;
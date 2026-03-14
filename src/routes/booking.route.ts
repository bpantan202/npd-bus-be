import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingByCode,
  updateBooking,
  deleteBooking,
  useBooking,
  getBookedSeats,
  searchPassengerBookings,
} from "../controllers/booking.controller";
import { requireAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.post("/booking", authMiddleware, createBooking);

router.get("/bookings", authMiddleware, requireAdmin, getAllBookings);

router.post("/bookings/search", searchPassengerBookings);

router.get("/bookings/my-booking", authMiddleware, getMyBookings);

router.get("/bookings/:booking_code", authMiddleware, getBookingByCode);

router.put("/bookings/:id", updateBooking);

router.delete("/bookings/:id", deleteBooking);

router.patch("/bookings/use/:booking_code", useBooking);

router.get("/booked-seats", getBookedSeats);

export default router;

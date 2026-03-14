import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { decryptBooking } from "../utils/decryptBooking";
import { encrypt } from "../utils/encryptionBooking";

// CREATE booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const bookingData = {
      ...req.body,
      user_id: userId || null,
    };

    const booking = new Booking(bookingData);

    await booking.save();

    const populatedBooking = await booking.populate("round_id");

    res.status(201).json(populatedBooking);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This seat is already booked for this date",
      });
    }

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

// UPDATE booking
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate("round_id");

  res.json(booking);
};

// DELETE booking
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Booking.findByIdAndDelete(id);

  res.json({
    message: "Booking deleted",
  });
};

// GET all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "round_id",
        populate: {
          path: "route_id",
          select: "origin destination",
        },
      })
      .populate({
        path: "user_id",
        select: "username",
      });

    const result = bookings.map(decryptBooking);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingByCode = async (req: Request, res: Response) => {
  try {
    const { booking_code } = req.params;

    const booking = await Booking.findOne({
      booking_code: booking_code,
    })
      .populate({
        path: "round_id",
        populate: {
          path: "route_id",
          select: "origin destination",
        },
      })
      .populate({
        path: "user_id",
        select: "username",
      });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const userId = (req as any).userId;
    const role = (req as any).role;

    // ✅ Admin can view everything
    if (booking.user_id) {
      // Only owner or admin can view
      if (role !== "admin" && booking.user_id._id.toString() !== userId) {
        return res.status(403).json({
          message: "You are not allowed to view this booking",
        });
      }
    }

    const result = decryptBooking(booking);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const bookings = await Booking.find({
      user_id: { $eq: userId, $ne: null },
    })
      .populate({
        path: "round_id",
        populate: {
          path: "route_id",
          select: "origin destination",
        },
      })
      .populate({
        path: "user_id",
        select: "username",
      });

    const result = bookings.map(decryptBooking);

    res.json(result); // [] if empty
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch my bookings",
    });
  }
};

export const searchPassengerBookings = async (req: Request, res: Response) => {
  try {
    const { phone, name } = req.query;

    const query: any = {};

    if (phone) {
      query["passenger.phone"] = phone;
    }

    if (name) {
      query["passenger.name"] = {
        $regex: `^${name}$`,
        $options: "i", // case-insensitive
      };
    }

    const bookings = await Booking.find(query)
      .populate({
        path: "round_id",
        populate: {
          path: "route_id",
          select: "origin destination",
        },
      })
      .populate({
        path: "user_id",
        select: "username",
      });

    const result = bookings.map(decryptBooking);

    res.json(result); // [] if none
  } catch (error) {
    res.status(500).json({
      message: "Failed to search bookings",
    });
  }
};

export const useBooking = async (req: Request, res: Response) => {
  try {
    const { booking_code } = req.params;

    const booking = await Booking.findOne({ booking_code });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "used") {
      return res.status(400).json({ message: "Ticket already used" });
    }

    booking.status = "used";
    await booking.save();

    await booking.populate("round_id");

    res.json({
      message: "Ticket marked as used",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking status",
    });
  }
};

export const getBookedSeats = async (req: Request, res: Response) => {
  try {
    const { round_id, departure_date } = req.query;

    if (!round_id || !departure_date) {
      return res.status(400).json({
        message: "round_id and departure_date are required",
      });
    }

    const bookings = await Booking.find({
      round_id,
      departure_date,
      status: { $ne: "cancelled" }, // ignore cancelled tickets
    }).select("seat_number -_id");

    const seats = bookings
      .map((b) => b.seat_number)
      .sort((a, b) => {
        const numA = parseInt(a.slice(1));
        const numB = parseInt(b.slice(1));
        return numA - numB;
      });

    res.json({
      round_id,
      departure_date,
      seats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booked seats",
    });
  }
};

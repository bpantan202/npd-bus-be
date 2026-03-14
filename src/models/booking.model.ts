import mongoose from "mongoose";
import { encrypt } from "../utils/encryptionBooking";

function generateBookingCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

const bookingSchema = new mongoose.Schema(
  {
    booking_code: {
      type: String,
      unique: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["confirmed", "used", "cancelled"],
      default: "confirmed",
    },

    round_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },

    departure_date: {
      type: String,
      required: true,
    },

    seat_number: {
      type: String,
      required: true,
      uppercase: true,
    },

    pickup_point: {
      type: String,
      required: true,
      trim: true,
    },

    dropoff_point: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      default: "",
    },

    passenger: {
      id_type: {
        type: String,
        enum: ["thai_id", "passport"],
        required: true,
      },

      id_number: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      surname: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
      },

      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
    },
  },
  { timestamps: true },
);

bookingSchema.index(
  { round_id: 1, departure_date: 1, seat_number: 1 },
  { unique: true },
);

bookingSchema.pre("save", async function () {
  if (this.passenger?.id_number) {
    this.passenger.id_number = encrypt(this.passenger.id_number);
  }

  if (!this.booking_code) {
    let code;
    let exists = true;

    while (exists) {
      code = generateBookingCode();

      const found = await mongoose.models.Booking.findOne({
        booking_code: code,
      });

      if (!found) {
        exists = false;
      }
    }

    this.booking_code = code;
  }
});

export const Booking = mongoose.model("Booking", bookingSchema);

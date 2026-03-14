import mongoose, { Schema } from "mongoose";
import { encrypt } from "../utils/encryptionBooking";

const passengerSchema = new Schema({
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
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  passenger: passengerSchema,
});

/* Encrypt ID before saving */
userSchema.pre("save", async function () {
  try {
    if (!this.isModified("passenger.id_number")) return;

    if (this.passenger?.id_number) {
      this.passenger.id_number = encrypt(this.passenger.id_number);
    }
  } catch (err) {
    console.error("Encryption error:", err);
    throw err;
  }
});

export const User = mongoose.model("User", userSchema);

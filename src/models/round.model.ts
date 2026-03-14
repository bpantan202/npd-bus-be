import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route_Info",
      required: true,
    },

    bus_type: {
      type: String,
      enum: ["GOLD_CLASS", "FIRST_CLASS"],
      required: true,
    },

    departure: {
      type: String,
      required: true,
    },

    arrival: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Round = mongoose.model("Round", roundSchema);

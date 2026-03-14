import mongoose from "mongoose";

const routeInfoSchema = new mongoose.Schema({
  route_id: { type: String, required: true },

  origin: { type: String, required: true },

  destination: { type: String, required: true },

  distance_km: { type: Number, required: true },

  duration_minutes: { type: Number, required: true },

  pickup_points: {
    type: [String],
    required: true
  },

  destination_points: {
    type: [String],
    required: true
  },

  flex_stops: {
    type: [String],
    required: true
  },

  prices: {
    gold_class: {
      normal: { type: Number, required: true },
      member: { type: Number, required: true }
    },
    first_class: {
      normal: { type: Number, required: true },
      member: { type: Number, required: true }
    }
  }
});

export const RouteInfo = mongoose.model(
  "route_info",
  routeInfoSchema,
);
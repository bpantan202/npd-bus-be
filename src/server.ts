import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import routeInfoRoutes from "./routes/routeInfo.route";
import bookingRoutes from "./routes/booking.route";
import roundRoutes from "./routes/round.route"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FE_DOMAIN,
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI as string)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/api", routeInfoRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roundRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
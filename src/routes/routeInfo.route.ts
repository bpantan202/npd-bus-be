import express from "express";
import {
  getAllRoutes,
  getRouteById,
} from "../controllers/routeInfo.controller";

const router = express.Router();

router.get("/routes", getAllRoutes);

router.get("/routes/:route_id", getRouteById);

export default router;
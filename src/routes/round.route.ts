import express from "express";
import { getRoundsByRoute, getRoundById } from "../controllers/round.controller";

const router = express.Router();

router.get("/routes/:route_id/rounds", getRoundsByRoute);
router.get("/rounds/:round_id", getRoundById);

export default router;
import { Request, Response } from "express";
import { Round } from "../models/round.model";

export const getRoundsByRoute = async (req: Request, res: Response) => {
  try {
    const { route_id } = req.params;

    const rounds = await Round.find({ route_id });

    console.log("rounds:", rounds);

    res.json(rounds);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rounds" });
  }
};

export const getRoundById = async (req: Request, res: Response) => {
  try {
    const { round_id } = req.params;

    const round = await Round.findById(round_id);

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.json(round);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch round" });
  }
};
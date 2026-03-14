import { Request, Response } from "express";
import { RouteInfo } from "../models/routeInfo.model";
import { Round } from "../models/round.model";

export const getAllRoutes = async (req: Request, res: Response) => {
  try {

    const routes = await RouteInfo.aggregate([
      {
        $lookup: {
          from: "rounds",          // collection name
          localField: "_id",       // route _id
          foreignField: "route_id",// round.route_id
          as: "rounds"
        }
      }
    ]);

    res.status(200).json(routes);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching routes",
      error
    });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const { route_id } = req.params;

    const route = await RouteInfo.findOne({ route_id });

    if (!route) {
      return res.status(404).json({
        message: "Route not found"
      });
    }

    const rounds = await Round.find({ route_id: route._id });

    res.json({
      ...route.toObject(),
      rounds
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching route"
    });
  }
};

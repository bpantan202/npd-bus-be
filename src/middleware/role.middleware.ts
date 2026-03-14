import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const role = (req as any).role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};
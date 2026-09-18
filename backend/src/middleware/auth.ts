import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized — no token provided"));
  }

  try {
    req.user = verifyToken(header.split(" ")[1]);
    next();
  } catch {
    next(new ApiError(401, "Session expired or token is invalid"));
  }
};
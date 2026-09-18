import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
};
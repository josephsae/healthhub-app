import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

interface JwtPayload {
  userId: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      new ApiError(401, "ACCESS_DENIED", "Se requiere autenticación para acceder a este recurso.")
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(
      new ApiError(401, "ACCESS_DENIED", "Token de autenticación no proporcionado.")
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(
      new ApiError(401, "INVALID_TOKEN", "Token de autenticación inválido o expirado.")
    );
  }
};

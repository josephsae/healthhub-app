import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Medication } from "../entities/Medication";
import { ApiError } from "../utils/ApiError";

export const getAllMedications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const medications = await AppDataSource.getRepository(Medication).find();
    res.status(200).json({ medications });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Error al obtener los medicamentos"
      )
    );
  }
};

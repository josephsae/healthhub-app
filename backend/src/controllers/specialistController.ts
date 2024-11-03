import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Specialist } from "../entities/Specialist";
import { ApiError } from "../utils/ApiError";
import { instanceToPlain } from "class-transformer";

export const getAllSpecialists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const specialists = await AppDataSource.getRepository(Specialist).find({
      order: { name: "ASC" },
    });
    res.status(200).json({
      specialists: specialists.map((specialist) => instanceToPlain(specialist)),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener los especialistas."
      )
    );
  }
};

export const getSpecialistById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const specialistId = parseInt(req.params.id, 10);
  try {
    const specialist = await AppDataSource.getRepository(Specialist).findOne({
      where: { id: specialistId },
    });
    if (!specialist) {
      return next(
        new ApiError(404, "SPECIALIST_NOT_FOUND", "El especialista no existe.")
      );
    }
    res.status(200).json({
      specialist: instanceToPlain(specialist),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener el especialista."
      )
    );
  }
};

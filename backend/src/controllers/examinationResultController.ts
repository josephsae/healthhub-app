import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { ExaminationResult } from "../entities/ExaminationResult";
import { ApiError } from "../utils/ApiError";

export const getExaminationResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    return next(
      new ApiError(
        401,
        "USER_ID_NOT_FOUND",
        "El ID de usuario no fue encontrado."
      )
    );
  }
  try {
    const examinationResults = await AppDataSource.getRepository(
      ExaminationResult
    ).find({
      relations: ["appointment", "examination", "procedure"],
      where: {
        appointment: {
          user: {
            id: userId,
          },
        },
      },
      order: { date: "DESC" },
    });
    res.status(200).json({
      examinationResults: examinationResults.map((result) => ({
        id: result.id,
        appointmentId: result.appointment.id,
        examination: {
          id: result.examination.id,
          name: result.examination.name,
        },
        procedure: result.procedure
          ? {
              id: result.procedure.id,
              name: result.procedure.name,
            }
          : null,
        resultData: result.resultData,
        date: result.date.toISOString(),
      })),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener los resultados de exámenes."
      )
    );
  }
};

export const getExaminationResultById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const examinationResultId = parseInt(req.params.id, 10);
  const userId = req.userId;
  if (!userId) {
    return next(
      new ApiError(
        401,
        "USER_ID_NOT_FOUND",
        "El ID de usuario no fue encontrado."
      )
    );
  }
  try {
    const examinationResult = await AppDataSource.getRepository(
      ExaminationResult
    ).findOne({
      where: { id: examinationResultId },
      relations: ["appointment", "examination", "procedure"],
    });
    if (
      !examinationResult ||
      examinationResult.appointment.user.id !== userId
    ) {
      return next(
        new ApiError(
          404,
          "EXAMINATION_RESULT_NOT_FOUND",
          "El resultado de examen no existe."
        )
      );
    }
    res.status(200).json({
      examinationResult: {
        id: examinationResult.id,
        appointmentId: examinationResult.appointment.id,
        examination: {
          id: examinationResult.examination.id,
          name: examinationResult.examination.name,
        },
        procedure: examinationResult.procedure
          ? {
              id: examinationResult.procedure.id,
              name: examinationResult.procedure.name,
            }
          : null,
        resultData: examinationResult.resultData,
        date: examinationResult.date.toISOString(),
      },
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener el resultado de examen."
      )
    );
  }
};

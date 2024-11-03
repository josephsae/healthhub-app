import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { MedicationRequest } from "../entities/MedicationRequest";
import { Medication } from "../entities/Medication";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import { instanceToPlain } from "class-transformer";

export const createMedicationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { medicationId } = req.body;
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
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!user) {
      return next(new ApiError(404, "USER_NOT_FOUND", "El usuario no existe."));
    }

    const medication = await AppDataSource.getRepository(Medication).findOne({
      where: { id: medicationId },
    });

    if (!medication) {
      return next(
        new ApiError(404, "MEDICATION_NOT_FOUND", "El medicamento no existe.")
      );
    }

    const medicationRequestRepository =
      AppDataSource.getRepository(MedicationRequest);
    const medicationRequest = medicationRequestRepository.create({
      medication,
      user,
    });

    await medicationRequestRepository.save(medicationRequest);

    res.status(201).json({
      message: "Solicitud de medicamento creada exitosamente.",
      medicationRequest: instanceToPlain(medicationRequest),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al crear la solicitud de medicamento."
      )
    );
  }
};

export const getMedicationRequests = async (
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
    const medicationRequests = await AppDataSource.getRepository(
      MedicationRequest
    ).find({
      where: { user: { id: userId } },
      relations: ["medication"],
      order: { requestedAt: "DESC" },
    });

    const formattedMedicationRequests = medicationRequests.map((request) => ({
      id: request.id,
      medication: {
        id: request.medication.id,
        name: request.medication.name,
        description: request.medication.description,
      },
      status: request.status,
      requestedAt: request.requestedAt.toISOString(),
      approvedAt: request.approvedAt ? request.approvedAt.toISOString() : null,
      rejectedAt: request.rejectedAt ? request.rejectedAt.toISOString() : null,
      comments: request.comments,
    }));

    res.status(200).json({
      medicationRequests: formattedMedicationRequests,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener las solicitudes de medicamentos."
      )
    );
  }
};

export const getMedicationRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const medicationRequestId = parseInt(req.params.id, 10);
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
    const medicationRequest = await AppDataSource.getRepository(
      MedicationRequest
    ).findOne({
      where: { id: medicationRequestId, user: { id: userId } },
      relations: ["medication"],
    });

    if (!medicationRequest) {
      return next(
        new ApiError(
          404,
          "MEDICATION_REQUEST_NOT_FOUND",
          "La solicitud de medicamento no existe."
        )
      );
    }

    const formattedMedicationRequest = {
      id: medicationRequest.id,
      medication: {
        id: medicationRequest.medication.id,
        name: medicationRequest.medication.name,
        description: medicationRequest.medication.description,
      },
      status: medicationRequest.status,
      requestedAt: medicationRequest.requestedAt.toISOString(),
      approvedAt: medicationRequest.approvedAt
        ? medicationRequest.approvedAt.toISOString()
        : null,
      rejectedAt: medicationRequest.rejectedAt
        ? medicationRequest.rejectedAt.toISOString()
        : null,
      comments: medicationRequest.comments,
    };

    res.status(200).json({
      medicationRequest: formattedMedicationRequest,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener la solicitud de medicamento."
      )
    );
  }
};

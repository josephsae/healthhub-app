import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Authorization } from "../entities/Authorization";
import { MedicationRequest } from "../entities/MedicationRequest";
import { User } from "../entities/User";
import { AuthorizationType } from "../enums/AuthorizationType";
import { ApiError } from "../utils/ApiError";
import { instanceToPlain } from "class-transformer";

export const createAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { type, request, medicationRequestId } = req.body;
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

    let medicationRequest: MedicationRequest | null = null;
    if (type === AuthorizationType.MEDICATION_REQUEST) {
      if (!medicationRequestId) {
        return next(
          new ApiError(
            400,
            "VALIDATION_ERROR",
            "El ID de la solicitud de medicamento es obligatorio para el tipo 'MEDICATION_REQUEST'."
          )
        );
      }
      medicationRequest = await AppDataSource.getRepository(
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
    }

    const authorizationRepository = AppDataSource.getRepository(Authorization);
    const authorization = authorizationRepository.create({
      type,
      request,
      user,
      medicationRequest,
    });

    await authorizationRepository.save(authorization);

    res.status(201).json({
      message: "Autorización creada exitosamente.",
      authorization: instanceToPlain(authorization),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al crear la autorización."
      )
    );
  }
};

export const getAuthorizations = async (
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
    const authorizations = await AppDataSource.getRepository(
      Authorization
    ).find({
      where: { user: { id: userId } },
      relations: ["medicationRequest", "medicationRequest.medication"],
      order: { createdAt: "DESC" },
    });

    const formattedAuthorizations = authorizations.map((auth) => ({
      id: auth.id,
      type: auth.type,
      status: auth.status,
      request: auth.request,
      medicationRequest: auth.medicationRequest
        ? {
            id: auth.medicationRequest.id,
            medication: {
              id: auth.medicationRequest.medication.id,
              name: auth.medicationRequest.medication.name,
              description: auth.medicationRequest.medication.description,
            },
            status: auth.medicationRequest.status,
            requestedAt: auth.medicationRequest.requestedAt.toISOString(),
            approvedAt: auth.medicationRequest.approvedAt
              ? auth.medicationRequest.approvedAt.toISOString()
              : null,
            rejectedAt: auth.medicationRequest.rejectedAt
              ? auth.medicationRequest.rejectedAt.toISOString()
              : null,
            comments: auth.medicationRequest.comments,
          }
        : null,
      createdAt: auth.createdAt.toISOString(),
    }));

    res.status(200).json({
      authorizations: formattedAuthorizations,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener las autorizaciones."
      )
    );
  }
};

export const getAuthorizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorizationId = parseInt(req.params.id, 10);
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
    const authorization = await AppDataSource.getRepository(
      Authorization
    ).findOne({
      where: { id: authorizationId, user: { id: userId } },
      relations: ["medicationRequest", "medicationRequest.medication"],
    });

    if (!authorization) {
      return next(
        new ApiError(
          404,
          "AUTHORIZATION_NOT_FOUND",
          "La autorización no existe."
        )
      );
    }

    const formattedAuthorization = {
      id: authorization.id,
      type: authorization.type,
      status: authorization.status,
      request: authorization.request,
      medicationRequest: authorization.medicationRequest
        ? {
            id: authorization.medicationRequest.id,
            medication: {
              id: authorization.medicationRequest.medication.id,
              name: authorization.medicationRequest.medication.name,
              description:
                authorization.medicationRequest.medication.description,
            },
            status: authorization.medicationRequest.status,
            requestedAt:
              authorization.medicationRequest.requestedAt.toISOString(),
            approvedAt: authorization.medicationRequest.approvedAt
              ? authorization.medicationRequest.approvedAt.toISOString()
              : null,
            rejectedAt: authorization.medicationRequest.rejectedAt
              ? authorization.medicationRequest.rejectedAt.toISOString()
              : null,
            comments: authorization.medicationRequest.comments,
          }
        : null,
      createdAt: authorization.createdAt.toISOString(),
    };

    res.status(200).json({
      authorization: formattedAuthorization,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener la autorización."
      )
    );
  }
};

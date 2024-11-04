import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Appointment } from "../entities/Appointment";
import { User } from "../entities/User";
import { Specialist } from "../entities/Specialist";
import { ApiError } from "../utils/ApiError";
import { instanceToPlain } from "class-transformer";

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { specialistId, date, reason } = req.body;
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

    const specialist = await AppDataSource.getRepository(Specialist).findOne({
      where: { id: specialistId },
    });

    if (!specialist) {
      return next(
        new ApiError(404, "SPECIALIST_NOT_FOUND", "El especialista no existe.")
      );
    }

    const appointment = AppDataSource.getRepository(Appointment).create({
      date,
      reason,
      user,
      specialist,
    });

    await AppDataSource.getRepository(Appointment).save(appointment);

    res.status(201).json({
      message: "Cita creada exitosamente.",
      appointment: instanceToPlain(appointment),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al crear la cita médica."
      )
    );
  }
};

export const getAppointments = async (
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
    const appointments = await AppDataSource.getRepository(Appointment).find({
      where: { user: { id: userId } },
      relations: [
        "specialist",
        "examinationResults",
        "examinationResults.examination",
        "examinationResults.procedure",
      ],
      order: { date: "DESC" },
    });

    const formattedAppointments = appointments.map((app) => ({
      id: app.id,
      date: app.date.toISOString(),
      reason: app.reason,
      specialist: {
        id: app.specialist.id,
        name: app.specialist.name,
        specialization: app.specialist.specialization,
      },
      examinationResults: app.examinationResults.map((result) => ({
        id: result.id,
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
    }));

    res.status(200).json({
      appointments: formattedAppointments,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener las citas médicas."
      )
    );
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentId = parseInt(req.params.id, 10);
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
    const appointment = await AppDataSource.getRepository(Appointment).findOne({
      where: { id: appointmentId, user: { id: userId } },
      relations: [
        "specialist",
        "examinationResults",
        "examinationResults.examination",
        "examinationResults.procedure",
      ],
    });

    if (!appointment) {
      return next(
        new ApiError(404, "APPOINTMENT_NOT_FOUND", "La cita no existe.")
      );
    }

    const formattedAppointment = {
      id: appointment.id,
      date: appointment.date.toISOString(),
      reason: appointment.reason,
      specialist: {
        id: appointment.specialist.id,
        name: appointment.specialist.name,
        specialization: appointment.specialist.specialization,
      },
      examinationResults: appointment.examinationResults.map((result) => ({
        id: result.id,
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
    };

    res.status(200).json({
      appointment: formattedAppointment,
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener la cita médica."
      )
    );
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentId = parseInt(req.params.id, 10);
  const { specialistId, date, reason } = req.body;
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
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepository.findOne({
      where: { id: appointmentId, user: { id: userId } },
      relations: ["specialist"],
    });

    if (!appointment) {
      return next(
        new ApiError(404, "APPOINTMENT_NOT_FOUND", "La cita no existe.")
      );
    }

    if (specialistId) {
      const specialist = await AppDataSource.getRepository(Specialist).findOne({
        where: { id: specialistId },
      });
      if (!specialist) {
        return next(
          new ApiError(
            404,
            "SPECIALIST_NOT_FOUND",
            "El especialista no existe."
          )
        );
      }
      appointment.specialist = specialist;
    }

    if (date) {
      appointment.date = new Date(date);
    }

    if (reason) {
      appointment.reason = reason;
    }

    await appointmentRepository.save(appointment);

    res.status(200).json({
      message: "Cita actualizada exitosamente.",
      appointment: instanceToPlain(appointment),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al actualizar la cita médica."
      )
    );
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentId = parseInt(req.params.id, 10);
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
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepository.findOne({
      where: { id: appointmentId, user: { id: userId } },
    });

    if (!appointment) {
      return next(
        new ApiError(404, "APPOINTMENT_NOT_FOUND", "La cita no existe.")
      );
    }

    await appointmentRepository.remove(appointment);

    res.status(200).json({
      message: "Cita eliminada exitosamente.",
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al eliminar la cita médica."
      )
    );
  }
};

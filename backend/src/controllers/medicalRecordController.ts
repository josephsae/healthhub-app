import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { MedicalRecord } from "../entities/MedicalRecord";
import { ApiError } from "../utils/ApiError";
import { instanceToPlain } from "class-transformer";
import PDFDocument from "pdfkit";
import { Appointment } from "../entities/Appointment";
import { ExaminationResult } from "../entities/ExaminationResult";
import { MedicationRequest } from "../entities/MedicationRequest";

export const getMedicalRecords = async (
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
    const medicalRecords = await AppDataSource.getRepository(
      MedicalRecord
    ).find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
    res.status(200).json({
      medicalRecords: medicalRecords.map((record) => instanceToPlain(record)),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener las historias clínicas."
      )
    );
  }
};

export const getMedicalRecordById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const medicalRecordId = parseInt(req.params.id, 10);
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
    const medicalRecord = await AppDataSource.getRepository(
      MedicalRecord
    ).findOne({
      where: { id: medicalRecordId, user: { id: userId } },
    });
    if (!medicalRecord) {
      return next(
        new ApiError(
          404,
          "MEDICAL_RECORD_NOT_FOUND",
          "La historia clínica no existe."
        )
      );
    }
    res.status(200).json({
      medicalRecord: instanceToPlain(medicalRecord),
    });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al obtener la historia clínica."
      )
    );
  }
};

export const downloadMedicalRecordDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const medicalRecordId = parseInt(req.params.id, 10);
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
      const medicalRecord = await AppDataSource.getRepository(MedicalRecord).findOne({
        where: { id: medicalRecordId, user: { id: userId } },
      });
  
      if (!medicalRecord) {
        return next(
          new ApiError(
            404,
            "MEDICAL_RECORD_NOT_FOUND",
            "La historia clínica no existe."
          )
        );
      }
  
      const appointments = await AppDataSource.getRepository(Appointment).find({
        where: { user: { id: userId } },
        relations: ["specialist"],
        order: { date: "ASC" },
      });
  
      const examinationResults = await AppDataSource.getRepository(ExaminationResult).find({
        where: { appointment: { user: { id: userId } } },
        relations: ["examination", "procedure"],
        order: { date: "ASC" },
      });
  
      const medicationRequests = await AppDataSource.getRepository(MedicationRequest).find({
        where: { user: { id: userId } },
        relations: ["medication"],
        order: { requestedAt: "ASC" },
      });
  
      const doc = new PDFDocument();
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=HistoriaClinica_${medicalRecordId}.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);
  
      doc.fontSize(20).text("Historia Clínica", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`ID: ${medicalRecord.id}`);
      doc.text(`Usuario ID: ${userId}`);
      doc.text(`Fecha de Creación: ${medicalRecord.createdAt.toISOString()}`);
      doc.moveDown();
  
      doc.fontSize(16).text("Citas Médicas", { underline: true });
      appointments.forEach((appointment) => {
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${appointment.date.toISOString()}`);
        doc.text(`Especialista: ${appointment.specialist.name} (${appointment.specialist.specialization})`);
        doc.text(`Motivo: ${appointment.reason}`);
      });
      doc.moveDown();
  
      doc.fontSize(16).text("Resultados de Exámenes", { underline: true });
      examinationResults.forEach((result) => {
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${result.date.toISOString()}`);
        doc.text(`Examen: ${result.examination.name}`);
        if (result.procedure) doc.text(`Procedimiento: ${result.procedure.name}`);
        doc.text(`Resultado: ${result.resultData}`);
      });
      doc.moveDown();
  
      doc.fontSize(16).text("Solicitudes de Medicamentos", { underline: true });
      medicationRequests.forEach((request) => {
        doc.moveDown();
        doc.fontSize(12).text(`Fecha de Solicitud: ${request.requestedAt.toISOString()}`);
        doc.text(`Medicamento: ${request.medication.name}`);
        doc.text(`Descripción: ${request.medication.description}`);
        doc.text(`Estado: ${request.status}`);
        if (request.approvedAt) doc.text(`Fecha de Aprobación: ${request.approvedAt.toISOString()}`);
        if (request.rejectedAt) doc.text(`Fecha de Rechazo: ${request.rejectedAt.toISOString()}`);
        doc.text(`Comentarios: ${request.comments || "N/A"}`);
      });
  
      doc.end();
    } catch (error) {
      console.error(error);
      next(
        new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Ocurrió un error al generar el documento de la historia clínica."
        )
      );
    }
  };
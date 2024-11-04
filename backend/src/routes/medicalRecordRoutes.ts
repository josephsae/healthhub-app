import { Router, Request, Response, NextFunction } from "express";
import {
  getMedicalRecords,
  getMedicalRecordById,
  downloadMedicalRecordDocument,
} from "../controllers/medicalRecordController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateGetMedicalRecord = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la historia clínica debe ser un entero positivo."),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          "Errores en la validación de los datos.",
          errors.array()
        )
      );
    } else {
      next();
    }
  },
];

const validateDownloadDocument = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la historia clínica debe ser un entero positivo."),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          "Errores en la validación de los datos.",
          errors.array()
        )
      );
    } else {
      next();
    }
  },
];

router.get("/", asyncHandler(getMedicalRecords));
router.get(
  "/:id",
  validateGetMedicalRecord,
  asyncHandler(getMedicalRecordById)
);
router.get(
  "/:id/download",
  validateDownloadDocument,
  asyncHandler(downloadMedicalRecordDocument)
);

export default router;

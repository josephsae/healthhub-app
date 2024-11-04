import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { body, param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateCreateAppointment = [
  body("specialistId")
    .isInt({ gt: 0 })
    .withMessage(
      "El ID del especialista es obligatorio y debe ser un número entero positivo."
    ),
  body("date")
    .isISO8601()
    .toDate()
    .withMessage("La fecha debe estar en formato ISO 8601."),
  body("reason")
    .isString()
    .notEmpty()
    .withMessage("La razón de la cita es obligatoria."),
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

const validateUpdateAppointment = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la cita debe ser un entero positivo."),
  body("specialistId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID del especialista debe ser un número entero positivo."),
  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("La fecha debe estar en formato ISO 8601."),
  body("reason")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("La razón de la cita no puede estar vacía."),
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

const validateGetAppointment = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la cita debe ser un entero positivo."),
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

const validateDeleteAppointment = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la cita debe ser un entero positivo."),
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

router.post("/", validateCreateAppointment, asyncHandler(createAppointment));
router.get("/", asyncHandler(getAppointments));
router.get("/:id", validateGetAppointment, asyncHandler(getAppointmentById));
router.put("/:id", validateUpdateAppointment, asyncHandler(updateAppointment));
router.delete(
  "/:id",
  validateDeleteAppointment,
  asyncHandler(deleteAppointment)
);

export default router;

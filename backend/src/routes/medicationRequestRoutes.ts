import { Router, Request, Response, NextFunction } from "express";
import {
  createMedicationRequest,
  getMedicationRequests,
  getMedicationRequestById,
} from "../controllers/medicationRequestController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { body, param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateCreateMedicationRequest = [
  body("medicationId")
    .isInt({ gt: 0 })
    .withMessage(
      "El ID del medicamento es obligatorio y debe ser un número entero positivo."
    ),
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

const validateGetMedicationRequest = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage(
      "El ID de la solicitud de medicamento debe ser un entero positivo."
    ),
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

router.post(
  "/",
  validateCreateMedicationRequest,
  asyncHandler(createMedicationRequest)
);
router.get("/", asyncHandler(getMedicationRequests));
router.get(
  "/:id",
  validateGetMedicationRequest,
  asyncHandler(getMedicationRequestById)
);

export default router;

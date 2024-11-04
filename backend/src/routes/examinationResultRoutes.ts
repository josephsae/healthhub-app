import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import {
  getExaminationResults,
  getExaminationResultById,
} from "../controllers/examinationResultController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateGetExaminationResult = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID del resultado de examen debe ser un entero positivo."),
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

router.get("/", asyncHandler(getExaminationResults));

router.get(
  "/:id",
  validateGetExaminationResult,
  asyncHandler(getExaminationResultById)
);

export default router;

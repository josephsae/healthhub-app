import { Router, Request, Response, NextFunction } from "express";
import {
  getAllSpecialists,
  getSpecialistById,
} from "../controllers/specialistController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateGetSpecialist = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID del especialista debe ser un entero positivo."),
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

router.get("/", asyncHandler(getAllSpecialists));
router.get("/:id", validateGetSpecialist, asyncHandler(getSpecialistById));

export default router;

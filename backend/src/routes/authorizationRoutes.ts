import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import {
  createAuthorization,
  getAuthorizations,
  getAuthorizationById,
} from "../controllers/authorizationController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { body, param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateCreateAuthorization = [
  body("type")
    .isIn(["PROCEDURE", "MEDICATION_REQUEST"])
    .withMessage(
      "El tipo de autorización debe ser 'PROCEDURE' o 'MEDICATION_REQUEST'."
    ),
  body("request")
    .isString()
    .notEmpty()
    .withMessage("La solicitud es obligatoria."),
  body("medicationRequestId")
    .optional()
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

const validateGetAuthorization = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de la autorización debe ser un entero positivo."),
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
  validateCreateAuthorization,
  asyncHandler(createAuthorization)
);
router.get("/", asyncHandler(getAuthorizations));
router.get(
  "/:id",
  validateGetAuthorization,
  asyncHandler(getAuthorizationById)
);

export default router;

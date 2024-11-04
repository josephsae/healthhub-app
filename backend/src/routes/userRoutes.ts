import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

const router = Router();

const validateRegister = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio."),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),
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

const validateLogin = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio."),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("La contraseña es obligatoria."),
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

router.post("/register", validateRegister, asyncHandler(registerUser));
router.post("/login", validateLogin, asyncHandler(loginUser));

export default router;

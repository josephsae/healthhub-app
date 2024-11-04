import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      return next(
        new ApiError(
          400,
          "USER_ALREADY_EXISTS",
          "El nombre de usuario ya está en uso."
        )
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(user);
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al registrar el usuario."
      )
    );
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });
    if (!user) {
      return next(
        new ApiError(
          400,
          "INVALID_CREDENTIALS",
          "Nombre de usuario o contraseña inválidos."
        )
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(
        new ApiError(
          400,
          "INVALID_CREDENTIALS",
          "Nombre de usuario o contraseña inválidos."
        )
      );
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Ocurrió un error al iniciar sesión."
      )
    );
  }
};

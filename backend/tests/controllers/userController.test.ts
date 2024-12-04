import { registerUser, loginUser } from "../../src/controllers/userController";
import { AppDataSource } from "../../src/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/config/db");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("registerUser", () => {
  const mockRequest: Partial<Request> = { body: {} };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 400 if username already exists", async () => {
    mockRequest.body = { username: "existingUser", password: "password123" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOneBy: jest
        .fn()
        .mockResolvedValue({ id: 1, username: "existingUser" }),
    });

    await registerUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "El nombre de usuario ya está en uso.",
      })
    );
  });

  it("should register a new user successfully", async () => {
    mockRequest.body = { username: "newUser", password: "password123" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((user) => user),
      save: jest.fn().mockResolvedValue({ id: 1, username: "newUser" }),
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    await registerUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Usuario registrado exitosamente.",
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    mockRequest.body = { username: "newUser", password: "password123" };

    await registerUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al registrar el usuario.",
      })
    );
  });
});

describe("loginUser", () => {
  const mockRequest: Partial<Request> = { body: {} };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 400 if username does not exist", async () => {
    mockRequest.body = { username: "nonexistentUser", password: "password123" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOneBy: jest.fn().mockResolvedValue(null),
    });

    await loginUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Nombre de usuario o contraseña inválidos.",
      })
    );
  });

  it("should return 400 if password is invalid", async () => {
    mockRequest.body = { username: "validUser", password: "wrongPassword" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOneBy: jest
        .fn()
        .mockResolvedValue({
          id: 1,
          username: "validUser",
          password: "hashedPassword",
        }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Nombre de usuario o contraseña inválidos.",
      })
    );
  });

  it("should login successfully and return a token", async () => {
    mockRequest.body = { username: "validUser", password: "password123" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOneBy: jest
        .fn()
        .mockResolvedValue({
          id: 1,
          username: "validUser",
          password: "hashedPassword",
        }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    await loginUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    mockRequest.body = { username: "validUser", password: "password123" };

    await loginUser(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al iniciar sesión.",
      })
    );
  });
});

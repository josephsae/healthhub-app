import { Request, Response, NextFunction } from "express";
import { createAppointment } from "../../src/controllers/appointmentController";
import { AppDataSource } from "../../src/config/db";
import { Appointment } from "../../src/entities/Appointment";
import { User } from "../../src/entities/User";
import { Specialist } from "../../src/entities/Specialist";

jest.mock("../../src/config/db");

describe("createAppointment", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
    body: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 401 if userId is not found", async () => {
    mockRequest.userId = undefined;

    await createAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("El ID de usuario no fue encontrado.")
    );
  });

  it("should return 404 if user does not exist", async () => {
    mockRequest.userId = 123;
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await createAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("El usuario no existe.")
    );
  });

  it("should create an appointment successfully", async () => {
    const mockUser = { id: "123" } as unknown as User;
    const mockSpecialist = { id: "456" } as unknown as Specialist;
    const mockAppointment = {
      id: "789",
      date: new Date(),
      reason: "Test",
    } as unknown as Appointment;

    AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
      if (entity === User) {
        return { findOne: jest.fn().mockResolvedValue(mockUser) };
      }
      if (entity === Specialist) {
        return { findOne: jest.fn().mockResolvedValue(mockSpecialist) };
      }
      if (entity === Appointment) {
        return {
          create: jest.fn().mockReturnValue(mockAppointment),
          save: jest.fn().mockResolvedValue(mockAppointment),
        };
      }
    });

    mockRequest.userId = 123;
    mockRequest.body = {
      specialistId: "456",
      date: "2024-11-18",
      reason: "Test Reason",
    };

    await createAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Cita creada exitosamente.",
      appointment: expect.any(Object),
    });
  });
});

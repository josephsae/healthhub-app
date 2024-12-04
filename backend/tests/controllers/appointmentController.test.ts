import { Request, Response, NextFunction } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
} from "../../src/controllers/appointmentController";
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

    expect(mockNext).toHaveBeenCalledWith(new Error("El usuario no existe."));
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

describe("getAppointments", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 401 if userId is not found", async () => {
    mockRequest.userId = undefined;

    await getAppointments(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "El ID de usuario no fue encontrado.",
      })
    );
  });

  it("should return a list of appointments successfully", async () => {
    const mockAppointments = [
      {
        id: 1,
        date: new Date(),
        reason: "Test Reason",
        specialist: { id: 1, name: "Dr. Smith", specialization: "Dermatology" },
        examinationResults: [],
      },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockAppointments),
    });

    mockRequest.userId = 123;

    await getAppointments(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      appointments: expect.any(Array),
    });
  });
});

describe("getAppointmentById", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
    params: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 401 if userId is not found", async () => {
    mockRequest.userId = undefined;

    await getAppointmentById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "El ID de usuario no fue encontrado.",
      })
    );
  });

  it("should return 404 if appointment is not found", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await getAppointmentById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "La cita no existe.",
      })
    );
  });

  it("should return the appointment successfully", async () => {
    const mockAppointment = {
      id: 1,
      date: new Date(),
      reason: "Test Reason",
      specialist: { id: 1, name: "Dr. Smith", specialization: "Dermatology" },
      examinationResults: [],
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockAppointment),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getAppointmentById(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      appointment: expect.any(Object),
    });
  });
});

describe("updateAppointment", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
    params: {},
    body: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 404 if appointment is not found", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await updateAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "La cita no existe.",
      })
    );
  });

  it("should update the appointment successfully", async () => {
    const mockAppointment = {
      id: 1,
      date: new Date(),
      reason: "Old Reason",
      specialist: { id: 1 },
    };

    const mockSpecialist = { id: 2 };

    AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
      if (entity === Appointment) {
        return {
          findOne: jest.fn().mockResolvedValue(mockAppointment),
          save: jest.fn(),
        };
      }
      if (entity === Specialist) {
        return {
          findOne: jest.fn().mockResolvedValue(mockSpecialist),
        };
      }
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };
    mockRequest.body = { reason: "New Reason" };

    await updateAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Cita actualizada exitosamente.",
      appointment: expect.any(Object),
    });
  });
});

describe("deleteAppointment", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
    params: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 404 if appointment is not found", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await deleteAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "La cita no existe.",
      })
    );
  });

  it("should delete the appointment successfully", async () => {
    const mockAppointment = { id: 1 };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockAppointment),
      remove: jest.fn().mockResolvedValue(null),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await deleteAppointment(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Cita eliminada exitosamente.",
    });
  });
});

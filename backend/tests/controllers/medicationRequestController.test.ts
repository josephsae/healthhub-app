import {
  createMedicationRequest,
  getMedicationRequestById,
  getMedicationRequests,
} from "../../src/controllers/medicationRequestController";
import { AppDataSource } from "../../src/config/db";
import { User } from "../../src/entities/User";
import { Medication } from "../../src/entities/Medication";
import { MedicationRequest } from "../../src/entities/MedicationRequest";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/config/db");

describe("createMedicationRequest", () => {
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

    await createMedicationRequest(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "El ID de usuario no fue encontrado.",
      })
    );
  });

  it("should return 404 if user does not exist", async () => {
    mockRequest.userId = 123;
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValueOnce(null),
    });

    await createMedicationRequest(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "El usuario no existe.",
      })
    );
  });

  it("should return 404 if medication does not exist", async () => {
    const mockUser = { id: 123 };
    AppDataSource.getRepository = jest
      .fn()
      .mockReturnValueOnce({
        findOne: jest.fn().mockResolvedValueOnce(mockUser),
      })
      .mockReturnValueOnce({
        findOne: jest.fn().mockResolvedValueOnce(null),
      });

    mockRequest.userId = 123;
    mockRequest.body = { medicationId: 456 };

    await createMedicationRequest(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "El medicamento no existe.",
      })
    );
  });

  it("should create a medication request successfully", async () => {
    const mockUser = { id: 123 } as User;
    const mockMedication = { id: 456, name: "Paracetamol" } as Medication;
    const mockMedicationRequest = {
      id: 789,
      medication: mockMedication,
      user: mockUser,
    };

    AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
      if (entity === User)
        return { findOne: jest.fn().mockResolvedValue(mockUser) };
      if (entity === Medication)
        return { findOne: jest.fn().mockResolvedValue(mockMedication) };
      if (entity === MedicationRequest) {
        return {
          create: jest.fn().mockReturnValue(mockMedicationRequest),
          save: jest.fn().mockResolvedValue(mockMedicationRequest),
        };
      }
    });

    mockRequest.userId = 123;
    mockRequest.body = { medicationId: 456 };

    await createMedicationRequest(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Solicitud de medicamento creada exitosamente.",
      medicationRequest: expect.any(Object),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    mockRequest.userId = 123;
    mockRequest.body = { medicationId: 456 };

    await createMedicationRequest(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al crear la solicitud de medicamento.",
      })
    );
  });
});

describe("getMedicationRequests", () => {
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

    await getMedicationRequests(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "El ID de usuario no fue encontrado.",
      })
    );
  });

  it("should return medication requests successfully", async () => {
    const mockMedicationRequests = [
      {
        id: 1,
        medication: {
          id: 456,
          name: "Paracetamol",
          description: "Pain reliever",
        },
        status: "PENDING",
        requestedAt: new Date(),
      },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockMedicationRequests),
    });

    mockRequest.userId = 123;

    await getMedicationRequests(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      medicationRequests: expect.any(Array),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;

    await getMedicationRequests(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener las solicitudes de medicamentos.",
      })
    );
  });
});

describe("getMedicationRequestById", () => {
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

    await getMedicationRequestById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "El ID de usuario no fue encontrado.",
      })
    );
  });

  it("should return 404 if medication request does not exist", async () => {
    mockRequest.params = { id: "1" };
    mockRequest.params.id = "1";

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await getMedicationRequestById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );
  });

  it("should return a medication request successfully", async () => {
    const mockMedicationRequest = {
      id: 1,
      medication: {
        id: 456,
        name: "Paracetamol",
        description: "Pain reliever",
      },
      status: "PENDING",
      requestedAt: new Date(),
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockMedicationRequest),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getMedicationRequestById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      medicationRequest: expect.any(Object),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getMedicationRequestById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener la solicitud de medicamento.",
      })
    );
  });
});

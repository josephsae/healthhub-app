import {
  getExaminationResultById,
  getExaminationResults,
} from "../../src/controllers/examinationResultController";
import { AppDataSource } from "../../src/config/db";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/config/db");

describe("getExaminationResults", () => {
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

    await getExaminationResults(mockRequest as Request, mockResponse, mockNext);
  });

  it("should return a list of examination results successfully", async () => {
    const mockExaminationResults = [
      {
        id: 1,
        appointment: { id: 10, user: { id: 123 } },
        examination: { id: 5, name: "Blood Test" },
        procedure: { id: 3, name: "Procedure A" },
        resultData: "Test Result Data",
        date: new Date(),
      },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockExaminationResults),
    });

    mockRequest.userId = 123;

    await getExaminationResults(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      examinationResults: expect.any(Array),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;

    await getExaminationResults(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener los resultados de exámenes.",
      })
    );
  });
});

describe("getExaminationResultById", () => {
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

    await getExaminationResultById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );
  });

  it("should return 404 if examination result does not exist", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await getExaminationResultById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "El resultado de examen no existe.",
      })
    );
  });

  it("should return 404 if examination result belongs to another user", async () => {
    const mockExaminationResult = {
      id: 1,
      appointment: { id: 10, user: { id: 456 } },
      examination: { id: 5, name: "Blood Test" },
      procedure: { id: 3, name: "Procedure A" },
      resultData: "Test Result Data",
      date: new Date(),
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockExaminationResult),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getExaminationResultById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "El resultado de examen no existe.",
      })
    );
  });

  it("should return the examination result successfully", async () => {
    const mockExaminationResult = {
      id: 1,
      appointment: { id: 10, user: { id: 123 } },
      examination: { id: 5, name: "Blood Test" },
      procedure: { id: 3, name: "Procedure A" },
      resultData: "Test Result Data",
      date: new Date(),
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockExaminationResult),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getExaminationResultById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      examinationResult: expect.any(Object),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getExaminationResultById(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener el resultado de examen.",
      })
    );
  });
});

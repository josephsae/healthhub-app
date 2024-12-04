import {
  getAllSpecialists,
  getSpecialistById,
} from "../../src/controllers/specialistController";
import { AppDataSource } from "../../src/config/db";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/config/db");

describe("getAllSpecialists", () => {
  const mockRequest: Partial<Request> = {};
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return a list of specialists successfully", async () => {
    const mockSpecialists = [
      { id: 1, name: "Dr. Alice", specialization: "Cardiology" },
      { id: 2, name: "Dr. Bob", specialization: "Neurology" },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockSpecialists),
    });

    await getAllSpecialists(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      specialists: expect.any(Array),
    });
  });

  it("should call next with an error if there is a server issue", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await getAllSpecialists(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener los especialistas.",
      })
    );
  });
});

describe("getSpecialistById", () => {
  const mockRequest: Partial<Request> = { params: {} };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return 404 if specialist does not exist", async () => {
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await getSpecialistById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "El especialista no existe.",
      })
    );
  });

  it("should return the specialist successfully", async () => {
    const mockSpecialist = {
      id: 1,
      name: "Dr. Alice",
      specialization: "Cardiology",
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockSpecialist),
    });

    mockRequest.params = { id: "1" };

    await getSpecialistById(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      specialist: expect.any(Object),
    });
  });

  it("should call next with an error if there is a server issue", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.params = { id: "1" };

    await getSpecialistById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener el especialista.",
      })
    );
  });
});

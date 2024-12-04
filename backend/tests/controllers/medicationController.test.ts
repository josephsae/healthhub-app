import { getAllMedications } from "../../src/controllers/medicationController";
import { AppDataSource } from "../../src/config/db";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/config/db");

describe("getAllMedications", () => {
  const mockRequest: Partial<Request> = {};
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
  });

  it("should return a list of medications successfully", async () => {
    const mockMedications = [
      { id: 1, name: "Paracetamol", description: "Pain reliever" },
      { id: 2, name: "Ibuprofen", description: "Anti-inflammatory" },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockMedications),
    });

    await getAllMedications(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      medications: mockMedications,
    });
  });

  it("should call next with an error if there is a server issue", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await getAllMedications(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Error al obtener los medicamentos",
      })
    );
  });
});

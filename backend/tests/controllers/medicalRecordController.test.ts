import {
  downloadMedicalRecordDocument,
  getMedicalRecordById,
  getMedicalRecords,
} from "../../src/controllers/medicalRecordController";
import { AppDataSource } from "../../src/config/db";
import { Request, Response, NextFunction } from "express";
import PDFDocument from "pdfkit";

jest.mock("../../src/config/db");
jest.mock("pdfkit");

describe("getMedicalRecords", () => {
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

    await getMedicalRecords(mockRequest as Request, mockResponse, mockNext);
  });

  it("should return a list of medical records successfully", async () => {
    const mockRecords = [
      { id: 1, createdAt: new Date(), user: { id: 123 } },
      { id: 2, createdAt: new Date(), user: { id: 123 } },
    ];

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue(mockRecords),
    });

    mockRequest.userId = 123;

    await getMedicalRecords(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      medicalRecords: expect.any(Array),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;

    await getMedicalRecords(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener las historias clínicas.",
      })
    );
  });
});

describe("getMedicalRecordById", () => {
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

    await getMedicalRecordById(mockRequest as Request, mockResponse, mockNext);
  });

  it("should return 404 if medical record does not exist", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await getMedicalRecordById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "La historia clínica no existe.",
      })
    );
  });

  it("should return the medical record successfully", async () => {
    const mockRecord = { id: 1, createdAt: new Date(), user: { id: 123 } };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockRecord),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getMedicalRecordById(mockRequest as Request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      medicalRecord: expect.any(Object),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await getMedicalRecordById(mockRequest as Request, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Ocurrió un error al obtener la historia clínica.",
      })
    );
  });
});

describe("downloadMedicalRecordDocument", () => {
  const mockRequest: Partial<Request> & { userId?: number } = {
    userId: undefined,
    params: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.setHeader = jest.fn();
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
    (PDFDocument.prototype.pipe as jest.Mock).mockImplementation(() => {});
    (PDFDocument.prototype.end as jest.Mock).mockImplementation(() => {});
  });

  it("should return 401 if userId is not found", async () => {
    mockRequest.userId = undefined;

    await downloadMedicalRecordDocument(
      mockRequest as Request,
      mockResponse,
      mockNext
    );
  });

  it("should return 404 if medical record does not exist", async () => {
    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    await downloadMedicalRecordDocument(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "La historia clínica no existe.",
      })
    );
  });

  it("should generate and download the medical record document successfully", async () => {
    const mockRecord = { id: 1, createdAt: new Date(), user: { id: 123 } };

    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockRecord),
      find: jest.fn().mockResolvedValue([]),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await downloadMedicalRecordDocument(
      mockRequest as Request,
      mockResponse,
      mockNext
    );
  });

  it("should return 500 if there is an internal server error", async () => {
    AppDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    mockRequest.userId = 123;
    mockRequest.params = { id: "1" };

    await downloadMedicalRecordDocument(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message:
          "Ocurrió un error al generar el documento de la historia clínica.",
      })
    );
  });
});

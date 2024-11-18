import { Request, Response, NextFunction } from "express";
import {
  createAuthorization,
  getAuthorizations,
  getAuthorizationById,
} from "../../src/controllers/authorizationController";
import { AppDataSource } from "../../src/config/db";
import { Authorization } from "../../src/entities/Authorization";
import { MedicationRequest } from "../../src/entities/MedicationRequest";
import { User } from "../../src/entities/User";
import { AuthorizationType } from "../../src/enums/AuthorizationType";

jest.mock("../../src/config/db");

describe("Authorization Controller", () => {
  const mockRequest: Partial<Request> & { userId?: number; params?: any } = {
    userId: undefined,
    body: {},
    params: {},
  };
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn();
    jest.clearAllMocks();
  });

  describe("createAuthorization", () => {
    it("should return 401 if userId is not found", async () => {
      await createAuthorization(mockRequest as Request, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error("El ID de usuario no fue encontrado.")
      );
    });

    it("should return 404 if user does not exist", async () => {
      mockRequest.userId = 123;
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      await createAuthorization(mockRequest as Request, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error("El usuario no existe."));
    });

    it("should return 400 if medicationRequestId is missing for MEDICATION_REQUEST type", async () => {
      mockRequest.userId = 123;
      mockRequest.body = { type: AuthorizationType.MEDICATION_REQUEST };
      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue({ id: 123 }),
      });

      await createAuthorization(mockRequest as Request, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error(
          "El ID de la solicitud de medicamento es obligatorio para el tipo 'MEDICATION_REQUEST'."
        )
      );
    });

    it("should create authorization successfully", async () => {
      const mockUser = { id: 123 } as User;
      const mockMedicationRequest = { id: 456 } as MedicationRequest;
      const mockAuthorization = { id: 789 } as Authorization;

      AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return { findOne: jest.fn().mockResolvedValue(mockUser) };
        }
        if (entity === MedicationRequest) {
          return {
            findOne: jest.fn().mockResolvedValue(mockMedicationRequest),
          };
        }
        if (entity === Authorization) {
          return {
            create: jest.fn().mockReturnValue(mockAuthorization),
            save: jest.fn().mockResolvedValue(mockAuthorization),
          };
        }
      });

      mockRequest.userId = 123;
      mockRequest.body = {
        type: AuthorizationType.MEDICATION_REQUEST,
        medicationRequestId: 456,
        request: "Sample Request",
      };

      await createAuthorization(mockRequest as Request, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Autorización creada exitosamente.",
        authorization: expect.any(Object),
      });
    });
  });

  describe("getAuthorizations", () => {
    it("should return 401 if userId is not found", async () => {
      await getAuthorizations(mockRequest as Request, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error("Ocurrió un error al obtener las autorizaciones.")
      );
    });
  });

  describe("getAuthorizationById", () => {
    it("should return 401 if userId is not found", async () => {
      await getAuthorizationById(
        mockRequest as Request,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new Error("Ocurrió un error al obtener la autorización.")
      );
    });

    it("should return 404 if authorization does not exist", async () => {
      mockRequest.userId = 123;
      mockRequest.params = { id: 1 };

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      await getAuthorizationById(
        mockRequest as Request,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new Error("La autorización no existe.")
      );
    });

    it("should return authorization for a valid user and ID", async () => {
      const mockAuthorization = {
        id: 1,
        type: AuthorizationType.MEDICATION_REQUEST,
        createdAt: new Date(),
      } as Authorization;

      AppDataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockAuthorization),
      });

      mockRequest.userId = 123;
      mockRequest.params = { id: 1 };

      await getAuthorizationById(
        mockRequest as Request,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        authorization: expect.any(Object),
      });
    });
  });
});

import api from "./api";

export const getAuthorizations = async () => {
  const response = await api.get("/authorizations");
  return response.data.authorizations; 
};

interface AuthorizationPayload {
  type: string;
  request: string;
  medicationRequestId?: number;
}

export const createAuthorization = async (payload: AuthorizationPayload) => {
  const response = await api.post("/authorizations", payload);
  return response.data;
};

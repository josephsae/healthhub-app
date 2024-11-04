import api from "./api";

interface Credentials {
  username: string;
  password: string;
}

export const login = async (credentials: Credentials): Promise<string> => {
  const response = await api.post("/users/login", credentials);
  return response.data.token;
};

export const register = async (credentials: Credentials): Promise<void> => {
  await api.post("/users/register", credentials);
};
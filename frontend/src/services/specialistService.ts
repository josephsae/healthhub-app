import api from "./api";

export const getSpecialists = async () => {
  const response = await api.get("/specialists");
  return response.data.specialists; 
};

import api from "./api";

export const getMedications = async () => {
  const response = await api.get("/medications");
  return response.data.medications;
};

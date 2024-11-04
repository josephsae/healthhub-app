import api from "./api";

export const createMedicationRequest = async (medicationId: number) => {
  const response = await api.post("/medication-requests", { medicationId });
  return response.data.medicationRequest;
};

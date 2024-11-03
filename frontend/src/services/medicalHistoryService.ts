import api from "./api";

export const fetchMedicalRecords = async () => {
  const response = await api.get("/medical-records");
  return response.data.medicalRecords;
};

export const downloadMedicalHistory = async (recordId: number) => {
  const response = await api.get(`/medical-records/${recordId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

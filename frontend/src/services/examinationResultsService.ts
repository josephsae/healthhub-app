import api from "./api";

export const fetchExaminationResults = async () => {
  const response = await api.get("/examination-results");
  return response.data;
};

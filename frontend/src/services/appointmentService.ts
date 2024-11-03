import api from "./api";

const APPOINTMENTS_URL = "/appointments";

export const getAppointments = async (): Promise<{ appointments: any[] }> => {
  const response = await api.get(APPOINTMENTS_URL);
  return response.data;
};

export const createAppointment = async (appointment: any): Promise<any> => {
  const response = await api.post(APPOINTMENTS_URL, appointment);
  return response.data;
};

export const updateAppointment = async (
  id: number,
  appointment: any
): Promise<any> => {
  const response = await api.put(`${APPOINTMENTS_URL}/${id}`, appointment);
  return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await api.delete(`${APPOINTMENTS_URL}/${id}`);
};

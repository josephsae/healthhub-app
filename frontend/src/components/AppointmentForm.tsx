import React, { useState, useEffect } from "react";
import {
  createAppointment,
  updateAppointment,
} from "../services/appointmentService";
import { getSpecialists } from "../services/specialistService";
import "./AppointmentForm.css";

interface Specialist {
  id: number;
  name: string;
  specialization: string;
}

interface Appointment {
  id?: number;
  patientName: string;
  doctorId: number;
  date: string;
  reason: string;
}

interface AppointmentFormProps {
  appointment: Appointment | null;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onClose,
}) => {
  const [patientName] = useState(appointment?.patientName || "");
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || 0);
  const [date, setDate] = useState(appointment?.date || "");
  const [reason, setReason] = useState(appointment?.reason || "");
  const [specialists, setSpecialists] = useState<Specialist[]>([]);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const data = await getSpecialists();
      setSpecialists(data || []);
    } catch (error) {
      console.error("Error fetching specialists:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (appointment && appointment.id) {
        await updateAppointment(appointment.id, {
          patientName,
          doctorId,
          date,
          reason,
        });
      } else {
        await createAppointment({ patientName, doctorId, date, reason });
      }
      onSubmit();
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <div className="appointment-form-container">
      <h2 className="appointment-form-title">
        {appointment ? "Editar Cita Médica" : "Crear Nueva Cita Médica"}
      </h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(Number(e.target.value))}
          className="appointment-select"
        >
          <option value="">Selecciona un especialista</option>
          {specialists.map((specialist) => (
            <option key={specialist.id} value={specialist.id}>
              {specialist.name} - {specialist.specialization}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="appointment-input"
        />
        <input
          type="text"
          placeholder="Razón"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="appointment-input"
        />
        <div className="button-container">
          <button type="submit" className="appointment-button">
            Guardar
          </button>
          <button
            type="button"
            className="appointment-button cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointmentService";
import AppointmentForm from "./AppointmentForm";
import "./AppointmentList.css";

interface Specialist {
  id: number;
  name: string;
  specialization: string;
}

interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  date: string;
  reason: string;
  specialist: Specialist;
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      alert("Cita cancelada con éxito");
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="appointment-list-container">
      <h2>Lista de Citas Médicas</h2>

      <ul className="appointment-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-item">
            <p><strong>Especialista:</strong> {appointment.specialist.name}</p>
            <p><strong>Especialización:</strong> {appointment.specialist.specialization}</p>
            <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleString()}</p>
            <p><strong>Razón:</strong> {appointment.reason}</p>
            <button
              onClick={() => handleEdit(appointment)}
              className="appointment-button"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(appointment.id)}
              className="appointment-button cancel-button"
            >
              Cancelar
            </button>
          </li>
        ))}
      </ul>

      <div className="button-group">
        <button onClick={() => navigate("/")} className="button">
          Volver a Inicio
        </button>
        <button onClick={() => setShowForm(true)} className="button">
          Crear Nueva Cita
        </button>
      </div>

      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AppointmentList;

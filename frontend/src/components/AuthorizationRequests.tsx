import React, { useEffect, useState } from "react";
import {
  getAuthorizations,
  createAuthorization,
} from "../services/authorizationService";
import { createMedicationRequest } from "../services/medicationRequestService";
import { getMedications } from "../services/medicationService";
import "./AuthorizationRequests.css";
import { useNavigate } from "react-router-dom";

interface Medication {
  id: number;
  name: string;
  description: string;
}

interface Authorization {
  id: number;
  type: string;
  status: string;
  request: string;
  medicationRequest: {
    medication: {
      name: string;
      description: string;
    };
    status: string;
    comments: string;
  };
  createdAt: string;
}

const AuthorizationRequests: React.FC = () => {
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationId, setMedicationId] = useState<number | null>(null);
  const [requestDescription, setRequestDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthorizations();
    fetchMedications();
  }, []);

  const fetchAuthorizations = async () => {
    try {
      const authData = await getAuthorizations();
      setAuthorizations(authData);
    } catch (error) {
      console.error("Error fetching authorizations:", error);
    }
  };

  const fetchMedications = async () => {
    try {
      const meds = await getMedications();
      setMedications(meds);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const handleAuthorizationRequest = async () => {
    if (!medicationId || !requestDescription) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const medicationRequest = await createMedicationRequest(medicationId);
      await createAuthorization({
        type: "MEDICATION_REQUEST",
        request: requestDescription,
        medicationRequestId: medicationRequest.id,
      });

      alert("Autorización creada con éxito");
      setMedicationId(null);
      setRequestDescription("");
      fetchAuthorizations();
    } catch (error) {
      console.error("Error creating authorization:", error);
      alert("Error al crear la autorización.");
    }
  };

  return (
    <div className="authorization-requests-container">
      <h2>Autorizaciones de Medicamentos</h2>

      <div className="authorization-list">
        <h3>Autorizaciones Actuales</h3>
        <ul>
          {authorizations.map((auth) => (
            <li key={auth.id}>
              <p>
                <strong>Tipo:</strong> {auth.type}
              </p>
              <p>
                <strong>Estado:</strong> {auth.status}
              </p>
              <p>
                <strong>Solicitud:</strong> {auth.request}
              </p>
              <p>
                <strong>Medicamento:</strong>{" "}
                {auth.medicationRequest.medication.name}
              </p>
              <p>
                <strong>Comentarios:</strong> {auth.medicationRequest.comments}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="authorization-form">
        <h3>Solicitar Autorización de Medicamento</h3>
        <select
          value={medicationId || ""}
          onChange={(e) => setMedicationId(Number(e.target.value))}
        >
          <option value="">Selecciona un medicamento</option>
          {medications.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name} - {med.description}
            </option>
          ))}
        </select>

        <textarea
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
          placeholder="Describe la solicitud de autorización"
        />

        <div className="button-group">
          <button onClick={() => navigate("/")} className="button">
            Volver a Inicio
          </button>
          <button onClick={handleAuthorizationRequest}>
            Crear Autorización
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationRequests;

// src/components/MedicalHistory.tsx
import React, { useEffect, useState } from "react";
import { fetchMedicalRecords, downloadMedicalHistory } from "../services/medicalHistoryService";
import { useNavigate } from "react-router-dom";
import "./MedicalHistory.css";

interface MedicalRecord {
  id: number;
  createdAt: string;
}

const MedicalHistory: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await fetchMedicalRecords();
        setMedicalRecords(records);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    fetchRecords();
  }, []);

  const handleDownload = async (recordId: number) => {
    try {
      const pdfData = await downloadMedicalHistory(recordId);
      const url = window.URL.createObjectURL(new Blob([pdfData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Historia_Clinica_${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading medical history:", error);
    }
  };

  return (
    <div className="medical-history-container">
      <h2>Historia Clínica</h2>
      <ul className="medical-record-list">
        {medicalRecords.map((record) => (
          <li key={record.id} className="medical-record-item">
            <p>Fecha de Creación: {new Date(record.createdAt).toLocaleDateString()}</p>
            <button onClick={() => handleDownload(record.id)} className="download-button">
              Descargar PDF
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)} className="back-button">
        Volver a Inicio
      </button>
    </div>
  );
};

export default MedicalHistory;

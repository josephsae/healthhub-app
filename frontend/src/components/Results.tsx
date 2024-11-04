// src/components/Results.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExaminationResults } from "../services/examinationResultsService";
import "./Results.css";

interface ExaminationResult {
  id: number;
  appointmentId: number;
  examination: {
    id: number;
    name: string;
  };
  procedure: {
    id: number;
    name: string;
  } | null;
  resultData: string;
  date: string;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<ExaminationResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await fetchExaminationResults();
        setResults(data.examinationResults);
      } catch (error) {
        console.error("Error fetching examination results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="results-container">
      <h2>Resultados de Exámenes</h2>
      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id} className="result-item">
            <p><strong>Examen:</strong> {result.examination.name}</p>
            {result.procedure && <p><strong>Procedimiento:</strong> {result.procedure.name}</p>}
            <p><strong>Resultado:</strong> {result.resultData}</p>
            <p><strong>Fecha:</strong> {new Date(result.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <button className="back-home-button" onClick={() => navigate("/")}>
        Volver a Inicio
      </button>
    </div>
  );
};

export default Results;

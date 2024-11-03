import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AppointmentList from "./components/AppointmentList";
import Chat from "./components/Chat";
import MedicalHistory from "./components/MedicalHistory";
import Results from "./components/Results";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthorizationRequests from "./components/AuthorizationRequests";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar el estado de autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false); // Terminamos de cargar el estado de autenticación
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Si todavía estamos cargando, muestra un loader o texto de "Cargando..."
  if (loading) return <div>Cargando...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register />} />
          {isAuthenticated && (
            <>
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/medical-history" element={<MedicalHistory />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/results" element={<Results />} />
              <Route path="/requests" element={<AuthorizationRequests />} />
            </>
          )}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import healthcareImage from "../assets/healthcare-image.png";
import logo from "../assets/healthcare-logo.webp";

interface HomePageProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-content">
          <img src={logo} alt="Healthcare Logo" className="logo" />
          <nav className="homepage-nav">
            <ul className="homepage-links">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/appointments" className="nav-link">
                      Gestionar Citas Médicas
                    </Link>
                  </li>
                  <li>
                    <Link to="/chat" className="nav-link">
                      Chat con Especialista
                    </Link>
                  </li>
                  <li>
                    <Link to="/results" className="nav-link">
                      Resultados de Exámenes
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests" className="nav-link">
                      Autorizaciones y Solicitud de Medicamentos
                    </Link>
                  </li>
                  <li>
                    <Link to="/medical-history" className="nav-link">
                      Historia Clínica
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={onLogout}
                      className="nav-link logout-button"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="nav-link compact-link">
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="nav-link compact-link">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <header className="homepage-header">
        <div className="header-content">
          <h1 className="homepage-title">
            Bienvenido a la Plataforma de Gestión de Salud
          </h1>
          <p className="homepage-subtitle">
            Administre sus citas, historia clínica, exámenes y más, de manera
            sencilla y eficiente.
          </p>
          <img
            src={healthcareImage}
            alt="Healthcare"
            className="homepage-banner"
          />
        </div>
      </header>

      <div className="homepage-services">
        <div className="service-card">
          <h3>Dentista General</h3>
          <p>
            Acceda a servicios de odontología general para mantener su salud
            dental óptima.
          </p>
        </div>
        <div className="service-card">
          <h3>Odontología Cosmética</h3>
          <p>
            Mejore su sonrisa con nuestros servicios de odontología cosmética.
          </p>
        </div>
        <div className="service-card">
          <h3>Emergencias Dentales</h3>
          <p>
            Estamos disponibles para ayudarle con cualquier emergencia dental.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

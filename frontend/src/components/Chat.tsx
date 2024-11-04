// src/components/Chat.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const navigate = useNavigate();

  const responses = [
    "Hola, ¿en qué puedo ayudarte?",
    "Dame un momento para revisar tu caso.",
    "Aquí tienes una recomendación: sigue el tratamiento indicado.",
    "Si tienes alguna duda adicional, no dudes en preguntar.",
    "Espero haberte ayudado. ¡Cuídate!",
  ];

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "usuario", text: userMessage },
      ]);

      setUserMessage("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "especialista", text: responses[responseIndex] },
        ]);
        setResponseIndex((prevIndex) => Math.min(prevIndex + 1, responses.length - 1));
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat con el Especialista</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "usuario" ? "user-message" : "specialist-message"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={userMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Enviar
        </button>
      </div>
      <button onClick={handleGoHome} className="back-home-button">
        Volver a Inicio
      </button>
    </div>
  );
};

export default Chat;

import React, { useState } from "react";
import "./css/message.css";

const Message = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        className="message-input"
      />
      <button type="submit" className="send-button">
        Отправить
      </button>
    </form>
  );
};

export default Message;

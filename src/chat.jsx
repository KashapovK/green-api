import React from "react";
import "./css/chat.css";

const Chat = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.from === "me" ? "me" : "other"}`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default Chat;

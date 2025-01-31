import React from "react";
import "./Chat.css";

const Chat = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.from === "me" ? "me" : "other"}`}
        >
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;

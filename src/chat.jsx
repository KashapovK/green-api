import React from "react";

const Chat = ({ messages }) => {
  return (
    <div
      style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc" }}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{ textAlign: msg.from === "me" ? "right" : "left" }}
        >
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;

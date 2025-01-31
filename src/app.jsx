import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./chat";
import Message from "./message";

const App = () => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleSendMessage = async (message) => {
    try {
      await axios.post(
        `https://api.green-api.com/wa/sendMessage/${idInstance}/${apiTokenInstance}`,
        {
          chatId: `${phoneNumber}@c.ru`,
          message: message,
        },
      );
      setMessages([...messages, { from: "me", text: message }]);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `https://api.green-api.com/wa/getMessages/${idInstance}/${apiTokenInstance}`,
      );
      const newMessages = response.data.filter(
        (msg) => msg.from === `${phoneNumber}@c.ru`,
      );
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    } catch (error) {
      console.error("Ошибка при загрузки сообщений:", error);
    }
  };

  useEffect(() => {
    if (chatStarted) {
      const interval = setInterval(fetchMessages, 5000); // Проверка новых сообщений каждые 5 секунд
      return () => clearInterval(interval);
    }
  }, [chatStarted]);

  return (
    <div>
      {!chatStarted ? (
        <div>
          <input
            type="text"
            placeholder="ID Instance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
          <input
            type="text"
            placeholder="API Token"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handleStartChat}>Start Chat</button>
        </div>
      ) : (
        <div>
          <Chat messages={messages} />
          <Message onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default App;

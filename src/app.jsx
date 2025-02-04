import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./chat";
import Message from "./message";

const App = () => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleSendMessage = async (message) => {
    const newMessage = { from: "me", text: message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await axios.post(
        `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          chatId: `${phoneNumber}@c.us`,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      // Удаляю сообщение из состояния в случае ошибки. Отключено в dev сборке
      /* setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.text !== message)
      ); */
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/waInstance${idInstance}/getMessage/${apiTokenInstance}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const newMessages = response.data.filter(
        (msg) =>
          msg.from === `${phoneNumber}@c.us` && msg.type === "textMessage",
      );

      setMessages((prevMessages) => {
        const existingMessages = new Set(prevMessages.map((msg) => msg.text));
        const filteredNewMessages = newMessages.filter(
          (msg) =>
            !existingMessages.has(msg.messageData.textMessageData.textMessage),
        );

        const formattedNewMessages = filteredNewMessages.map((msg) => ({
          from: msg.senderData.chatId,
          text: msg.messageData.textMessageData.textMessage,
          type: "textMessage", // По ТЗ приходит всегда текст,а так msg.messageData.typeMessage,
        }));

        return [...prevMessages, ...formattedNewMessages];
      });
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error);
    }
  };

  useEffect(() => {
    if (chatStarted) {
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatStarted]);

  return (
    <div>
      {!chatStarted ? (
        <div>
          <input
            type="url"
            placeholder="API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="ID"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="API Токен"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <input
            required
            type="tel"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handleStartChat}>Начать чат</button>
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

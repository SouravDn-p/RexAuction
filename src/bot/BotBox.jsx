import React from "react";
import ChatMessage from "./ChatMessage";
import ChatbotIcon from "./ChatbotIcon";
import ChatFrom from "./ChatFrom";
import { useState, useEffect, useRef } from "react";

const BotBox = () => {
  const [chatHistory, setCatchHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  // Function to generate model response
  const generateResponse = async (history) => {
    console.log(history);
    // Helper function to update chat history
    const updatedHistory = (text, isError = false) => {
      setCatchHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_GEMINI_API_URL,
        requestOptions
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong");
      }

      console.log(data);
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updatedHistory(apiResponseText);
    } catch (error) {
      updatedHistory(error.message, true);
    }
  };

  useEffect(() => {
    // Auto Scroll to the bottom of chat body
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""} h-screen`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggle"
      >
        <span className="material-symbols-outlined"> mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <p className="svg">
              <ChatbotIcon />
            </p>
            <h2 className="chatbot-logo text-2xl font-bold">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-outlined bg-gray-200"
          >
            keyboard_arrow_down
          </button>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <p className="svg">
              <ChatbotIcon />
            </p>
            <p className="message-text">
              Hey there 👌 <br /> How Can I Help You Today?
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatFrom
            chatHistory={chatHistory}
            setCatchHistory={setCatchHistory}
            generateResponse={generateResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default BotBox;

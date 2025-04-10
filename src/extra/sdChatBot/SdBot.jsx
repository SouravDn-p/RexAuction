"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, ChevronDown, Loader2 } from "lucide-react";
import Lottie from "lottie-react";
import chatAnimation from "./chat-animation.json";
import typingAnimation from "./typing-animation.json";
import "./chatbot.css";
import rexLogo from "../../assets/Logos/Rex_2.jpg";
import useAuth from "../../hooks/useAuth";
import ThemeContext from "../../component/Context/ThemeContext";

const SdBot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef();
  const { user, dbUser } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);

  // Function to generate model response
  const generateResponse = async (history) => {
    setIsLoading(true);

    // Helper function to update chat history
    const updatedHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
      setIsLoading(false);
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
        import.meta.env.VITE_GOOGLE_GEMENI_API,
        requestOptions
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updatedHistory(apiResponseText);
    } catch (error) {
      updatedHistory(error.message, true);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat history
    const newMessage = { role: "user", text: inputMessage };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);

    // Add thinking message
    setChatHistory([...updatedHistory, { role: "model", text: "Thinking..." }]);

    // Clear input
    setInputMessage("");

    // Generate response
    generateResponse(updatedHistory);
  };

  useEffect(() => {
    // Auto Scroll to the bottom of chat body
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${
        showChatbot ? "w-80 sm:w-96 md:w-[400px]" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        className={`btn btn-circle ${
          showChatbot
            ? "btn-error bg-yellow-400 absolute top-2 right-2 z-10"
            : "btn-primary shadow-lg"
        } transition-all duration-300`}
        aria-label={showChatbot ? "Close chatbot" : "Open chatbot"}
      >
        {showChatbot ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chatbot Container */}
      <div
        className={`bg-base-100 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col
          ${showChatbot ? "h-[500px] opacity-100" : "h-0 opacity-0"}`}
      >
        {/* Chatbot Header */}
        <div
          className={`${
            isDarkMode
              ? "bg-purple-900"
              : "bg-gradient-to-r from-purple-600 to-purple-500"
          } text-primary-content p-4 flex justify-between items-center`}
        >
          <div className="flex items-center gap-3 ">
            <div className="w-10 h-10">
              <Lottie
                animationData={chatAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className="btn btn-circle btn-sm btn-ghost"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Chatbot Body */}
        <div
          ref={chatBodyRef}
          className={`flex-1 overflow-y-auto p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } scroll-smooth`}
        >
          {/* Welcome Message */}
          <div className="chat chat-start mb-4">
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                <img
                  src={rexLogo}
                  alt="AI Assistant Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-primary text-sm leading-relaxed">
              Hello! 👋
              <br />
              I’m your AI assistant. How can I assist you today?
            </div>
          </div>

          {/* Chat History */}
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`chat ${
                chat.role === "user" ? "chat-end" : "chat-start"
              } mb-4`}
            >
              <div className="chat-image avatar">
                <div
                  className={`w-10 h-10 rounded-full ${
                    chat.role === "user" ? "bg-secondary" : "bg-primary"
                  } flex items-center justify-center`}
                >
                  {chat.role === "user" ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary">
                      <img
                        src={dbUser?.photo || "/default-user.png"}
                        alt="You"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                        <img
                          src={rexLogo}
                          alt="AI Assistant Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`chat-bubble ${
                  chat.role === "user"
                    ? "chat-bubble-secondary"
                    : chat.isError
                    ? "chat-bubble-error"
                    : "chat-bubble-primary"
                }`}
              >
                {chat.text === "Thinking..." ? (
                  <div className="flex items-center gap-2">
                    <span>Thinking</span>
                    <div className="w-12 h-6">
                      <Lottie
                        animationData={typingAnimation}
                        loop={true}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  chat.text
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="chat chat-start mb-4">
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <MessageSquare size={18} className="text-primary-content" />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-primary flex items-center gap-2">
                <span>Thinking</span>
                <div className="w-12 h-6">
                  <Lottie
                    animationData={typingAnimation}
                    loop={true}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chatbot Footer */}
        <form
          onSubmit={handleSubmit}
          className={`p-3 border-t border-base-300 flex gap-2 ${
            isDarkMode
              ? "bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className={`input input-bordered flex-1 ${
              isDarkMode
                ? `bg-[#1e293b] text-white placeholder-gray-400 border-gray-600 `
                : "bg-white text-gray-900 placeholder-gray-500"
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SdBot;

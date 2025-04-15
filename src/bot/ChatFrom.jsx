import { useRef } from "react";

const ChatFrom = ({ chatHistory, setCatchHistory, generateResponse }) => {
  const inputRef = useRef();

  const handleFromSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // Update chat history with user's message
    setCatchHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // simulate a "thinking..." response from the model"
    setTimeout(
      () =>
        setCatchHistory((history) => [
          ...history,
          { role: "model", text: "Thinking..." },
        ]),
      400
    );
    // call the function to generate a response
    generateResponse([...chatHistory, { role: "user", text: userMessage }]);
  };

  return (
    <div>
      <form action="#" className="chat-from" onSubmit={handleFromSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Message.."
          className="message-input"
          required
        />
        <button class="material-symbols-outlined bg-gray-200 ">
          arrow_upward
        </button>
      </form>
    </div>
  );
};

export default ChatFrom;

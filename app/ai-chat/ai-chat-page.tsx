import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./ai-chat-page.css";
import therynLogo from "./theryn.png"; // Make sure this path is correct

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user" as "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I'm Theryn! How can I help you today?",
        },
      ]);
    }, 600);
  };

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="ai-chat-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="theryn-label">
            <img src={therynLogo} alt="Theryn Logo" className="theryn-logo" />
            <h1>Theryn</h1>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="chat-input"
          />
          <button type="submit" className="send-button">→</button>
        </form>
      </div>
    </div>
  );
}

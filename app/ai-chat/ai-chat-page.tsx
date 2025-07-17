import React, { useState, useRef, useEffect } from "react";
import "./ai-chat-page.css";
import { useNavigate } from "react-router-dom";

export default function AIChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulated AI reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: "This is a simulated response." }]);
    }, 600);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="chat-header">
          <button className="back-button" onClick={() => navigate("/")}>← Back</button>
          <h1>AI Chat</h1>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-container" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="send-button">➤</button>
        </form>
      </div>
    </div>
  );
}

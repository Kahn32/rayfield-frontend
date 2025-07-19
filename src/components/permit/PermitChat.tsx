import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/api";

const PermitChat: React.FC = () => {
  const location = useLocation();
  const metadata = location.state?.metadata;
  const permitType = location.state?.permitType; // ✅ Get permitType
  const analysisModes = location.state?.analysisModes || []; // ✅ Get analysisModes

  console.log("✅ PermitChat loaded");
  console.log("📄 PermitChat metadata:", metadata);
  console.log("📄 PermitChat permitType:", permitType);
  console.log("📄 PermitChat analysisModes:", analysisModes);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! What would you like to know about this permit?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata,
          messages: newMessages,
          question: input,
          permitType,
          analysisModes,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat API request failed");
      }

      const data = await response.json();
      console.log("💬 Backend AI response:", data);

      const aiReply = {
        role: "assistant",
        content: data.answer || "I'm sorry, I couldn't find an answer.",
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error("❌ Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Failed to get a response from AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
        <p>No permit data found for chat.</p>
        <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Permit Chat</h1>
        <p className="text-muted-foreground">Ask questions about the uploaded permit</p>
      </div>

      <div className="bg-card rounded-lg border p-4 h-96 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground self-end ml-auto w-fit"
                : "bg-muted text-foreground self-start mr-auto w-fit"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg bg-muted text-foreground self-start mr-auto w-fit italic">
            Thinking...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default PermitChat;
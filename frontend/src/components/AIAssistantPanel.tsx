"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useAssistant, ASSISTANT_PANEL_WIDTH } from "@/context/AssistantContext";

// Deferred so KaTeX/markdown are fetched only once a reply is actually shown.
const MarkdownMessage = dynamic(() => import("@/components/common/MarkdownMessage"), {
  ssr: false,
  loading: () => null,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your study assistant. Ask me to explain a concept, walk through a practice question, or help you plan what to study next.",
};

export default function AIAssistantPanel() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, toggle } = useAssistant();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
      const response = await fetch(`${baseURL}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          context: `Current page: ${pathname}`,
          history: nextMessages
            .filter((m) => m !== WELCOME_MESSAGE)
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant request failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Assistant chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach the study assistant. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button - hidden once the side panel is open */}
      {!isOpen && (
        <button
          onClick={toggle}
          aria-label="Open study assistant"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#3A6EA5",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            fontSize: "24px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 200ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          💬
        </button>
      )}

      {/* Side panel - docked to the right edge, pushes page content over (does not overlay it) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : `-${ASSISTANT_PANEL_WIDTH + 20}px`,
          width: `min(${ASSISTANT_PANEL_WIDTH}px, 100vw)`,
          maxWidth: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.12)",
          borderLeft: "1px solid #e5e7eb",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          transition: "right 250ms ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#3A6EA5",
            color: "#ffffff",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>Study Assistant</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", opacity: 0.85 }}>
              Ask questions, get hints, or review concepts
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close study assistant"
            style={{
              background: "transparent",
              border: "none",
              color: "#ffffff",
              fontSize: "18px",
              lineHeight: 1,
              cursor: "pointer",
              padding: "4px",
              opacity: 0.9,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", backgroundColor: "#f9fafb" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  backgroundColor: msg.role === "user" ? "#3A6EA5" : "#ffffff",
                  color: msg.role === "user" ? "#ffffff" : "#1a1a1a",
                  border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                  minWidth: 0,
                  overflowX: "auto",
                  overflowWrap: "anywhere",
                }}
              >
                {msg.role === "user" ? (
                  <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0, fontFamily: "inherit" }}>
                    {msg.content}
                  </pre>
                ) : (
                  <MarkdownMessage content={msg.content} />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#6b7280",
                }}
              >
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                fontFamily: "inherit",
                maxHeight: "100px",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: !input.trim() || isLoading ? "#d1d5db" : "#3A6EA5",
                color: "#ffffff",
                fontWeight: 600,
                cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

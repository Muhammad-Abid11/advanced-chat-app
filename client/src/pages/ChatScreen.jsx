import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useAuthStore from "../store/useAuthStore";
import WelcomeChatScreen from "../components/common/WelcomeChatScreen";

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "Sarah",
    text: "Hey there! How is the new UI looking?",
    time: "10:05 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    text: "It looks amazing! The glassmorphism effect is sleek.",
    time: "10:06 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "John",
    text: "Agreed, the animations are super smooth.",
    time: "10:07 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Sarah",
    text: "Can we add voice messages later?",
    time: "10:08 AM",
    isMe: false,
  },
];

const ChatScreen = () => {
  const { user } = useAuthStore();
  const { chatId } = useParams();
  
  // Format chatId back to readable name
  const getChatName = (id) => {
    if (!id) return "General";
    return id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const activeChat = chatId ? {
    name: getChatName(chatId),
    isChannel: ["general", "designers", "development", "random"].includes(chatId?.toLowerCase()),
  } : null;

  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.name || user?.email || "Me",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div
      className="chat-screen-container"
      style={{ display: "flex", height: "100vh", padding: "20px", gap: "20px" }}
    >
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay mobile-only"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className="main-chat-area"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {activeChat ? (
          <>
            {/* Header */}
            <Header
              activeChat={activeChat}
              onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Messages */}
            <div
              className="glass"
              style={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  style={{
                    alignSelf: msg.isMe ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    display: "flex",
                    gap: "12px",
                    flexDirection: msg.isMe ? "row-reverse" : "row",
                  }}
                >
                  {!msg.isMe && (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {msg.sender[0]}
                    </div>
                  )}
                  <div>
                    {!msg.isMe && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "4px",
                          marginLeft: "4px",
                        }}
                      >
                        {msg.sender}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "12px 18px",
                        borderRadius: msg.isMe
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                        background: msg.isMe
                          ? "linear-gradient(135deg, var(--primary), var(--secondary))"
                          : "rgba(255,255,255,0.05)",
                        border: msg.isMe
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        marginTop: "4px",
                        textAlign: msg.isMe ? "right" : "left",
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="glass"
              style={{
                padding: "12px",
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <PlusCircle size={24} />
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Send</span>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : <WelcomeChatScreen user={user} setIsSidebarOpen={setIsSidebarOpen} />}
      </div>
    </div>
  );
};

export default ChatScreen;

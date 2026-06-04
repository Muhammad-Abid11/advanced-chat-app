import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, PlusCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useAuthStore from "../store/useAuthStore";
import WelcomeChatScreen from "../components/common/WelcomeChatScreen";

import useChatStore from "../store/useChatStore";
import { getSocket } from "../config/socket";

const ChatScreen = () => {
  const { user } = useAuthStore();
  const { chatId } = useParams();
  const { messages, getMessages, sendMessage, subscribeToMessages, unsubscribeFromMessages, chats, setSelectedChat, selectedChat } = useChatStore();
  
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      getMessages(chatId);
      
      // Join socket room
      const socket = getSocket();
      if (socket) {
        socket.emit("join chat", chatId);
      }

      // If selectedChat is not set or different, fetch/set it
      if (!selectedChat || selectedChat._id !== chatId) {
        const chat = chats.find(c => c._id === chatId);
        if (chat) {
          setSelectedChat(chat);
        } else {
          // Fetch from API if not in list
          useChatStore.getState().getChatById(chatId);
        }
      }
    }

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [chatId, getMessages, subscribeToMessages, unsubscribeFromMessages, setSelectedChat]);

  const activeChat = selectedChat ? {
    name: selectedChat.isGroupChat 
      ? selectedChat.chatName 
      : (selectedChat.participants.find(p => p._id !== user?._id)?.name || "Chat"),
    isChannel: false,
    isGroupChat: selectedChat.isGroupChat,
    participantsCount: selectedChat.participants.length,
  } : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || !chatId) return;

    const content = input;
    const file = imageFile;
    
    setInput(""); // Clear input early for better UX
    setImageFile(null);
    setImagePreview(null);

    await sendMessage(content, chatId, file);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (file.size > 20 * 1024 * 1024) {
        toast.error("Image size exceeds 20MB limit. Please select a smaller file.");
        e.target.value = "";
        return;
      }
        const options = {
          maxSizeMB: 1,        // max file size to compress (1MB)
          maxWidthOrHeight: 1920, // max width/height
          useWebWorker: true,
          fileType: "image/jpeg", // compress to jpeg
          initialQuality: 0.8 // 80% quality
        };

        toast.loading("Compressing image...");
        const compressedFile = await imageCompression(file, options);
        toast.dismiss();
        // console.log("Original size:", file.size / 1024 / 1024, "MB");
        // console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");

        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        toast.error("Error compressing image");
        console.log(error);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              {messages.map((msg) => {
                const isMe = msg.senderId._id === user?._id;
                const senderName = msg.senderId.name || "User";

                return (
                  <motion.div
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={msg._id}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      display: "flex",
                      gap: "12px",
                      flexDirection: isMe ? "row-reverse" : "row",
                    }}
                  >
                    {!isMe && (
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
                        {senderName[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      {!isMe && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            marginBottom: "4px",
                            marginLeft: "4px",
                          }}
                        >
                          {senderName}
                        </div>
                      )}
                      <div
                        style={{
                          padding: "12px 18px",
                          borderRadius: isMe
                            ? "20px 20px 4px 20px"
                            : "20px 20px 20px 4px",
                          background: isMe
                            ? "linear-gradient(135deg, var(--primary), var(--secondary))"
                            : "rgba(255,255,255,0.05)",
                          border: isMe
                            ? "none"
                            : "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                          fontSize: "0.95rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {msg.image && (
                          <img 
                            src={`${
                              msg.image?.includes("uploads") 
                                ? import.meta.env.VITE_API_BASE_URL + msg.image // server saved images in uploads folder 
                                : msg.image //  cloud storage uploaded images URLS  
                            }`}
                            alt="attachment" 
                            style={{ 
                              maxWidth: "100%", 
                              maxHeight: "200px", 
                              borderRadius: "8px", 
                              marginBottom: msg.content ? "8px" : "0",
                              display: "block"
                            }} 
                          />
                        )}
                        {msg.content && <span>{msg.content}</span>}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748b",
                          marginTop: "4px",
                          textAlign: isMe ? "right" : "left",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview Area */}
            {imagePreview && (
              <div style={{ padding: "0 24px", position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
                <div style={{ position: "relative" }}>
                  <img src={imagePreview} alt="Preview" style={{ height: "60px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <button 
                    onClick={removeImage}
                    style={{ 
                      position: "absolute", top: "-8px", right: "-8px", 
                      background: "rgba(0,0,0,0.6)", borderRadius: "50%", 
                      color: "white", padding: "2px", border: "none", cursor: "pointer" 
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

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
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleImageChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
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

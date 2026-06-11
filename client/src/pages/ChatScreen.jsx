import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, PlusCircle, X, Image as ImageIcon, Images as ImagesIcon, Video as VideoIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState("image/*");
  const [isMultiple, setIsMultiple] = useState(false);
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
    if ((!input.trim() && attachmentFiles.length === 0) || !chatId) return;

    const content = input;
    const files = [...attachmentFiles];
    
    setInput(""); // Clear input early for better UX
    setAttachmentFiles([]);
    setAttachmentPreviews([]);

    await sendMessage(content, chatId, files);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check limit
    if (attachmentFiles.length + files.length > 10) {
      toast.error("You can only upload up to 10 files at a time.");
      e.target.value = "";
      return;
    }

    let newFiles = [];
    let newPreviews = [];

    for (const file of files) {
      // Reject files larger than 20MB
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 20MB limit and was skipped.`);
        continue;
      }

      let fileToUpload = file;

      // Only compress if the file is an image and larger than 1MB
      if (file.type.startsWith("image/") && file.size > 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1,        // max file size to compress (1MB)
            maxWidthOrHeight: 1920, // max width/height
            useWebWorker: true,
            fileType: "image/jpeg", // compress to jpeg
            initialQuality: 0.8 // 80% quality
          };

          const toastId = toast.loading(`Compressing ${file.name}...`);
          fileToUpload = await imageCompression(file, options);
          toast.dismiss(toastId);
        } catch (error) {
          toast.dismiss();
          toast.error(`Error compressing ${file.name}`);
          console.log(error);
          continue; // Skip this file if compression fails
        }
      }

      newFiles.push(fileToUpload);
      newPreviews.push(URL.createObjectURL(fileToUpload));
    }

    if (newFiles.length > 0) {
      // If we are replacing (single upload) vs appending (multiple)
      if (isMultiple) {
        setAttachmentFiles(prev => [...prev, ...newFiles]);
        setAttachmentPreviews(prev => [...prev, ...newPreviews]);
      } else {
        setAttachmentFiles(newFiles);
        setAttachmentPreviews(newPreviews);
      }
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
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
                        {msg.images && msg.images.length > 0 ? (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: msg.images.length === 1 ? "1fr" : msg.images.length === 2 ? "1fr 1fr" : "repeat(auto-fit, minmax(100px, 1fr))",
                            gap: "4px",
                            marginBottom: msg.content ? "8px" : "0",
                            borderRadius: "8px",
                            overflow: "hidden"
                          }}>
                            {msg.images.map((imgUrl, i) => (
                              <img 
                                key={i}
                                src={`${imgUrl?.includes("uploads") ? import.meta.env.VITE_API_BASE_URL + imgUrl : imgUrl}`}
                                alt={`attachment-${i}`}
                                style={{ 
                                  width: "100%", 
                                  height: msg.images.length === 1 ? "auto" : "100px",
                                  maxHeight: msg.images.length === 1 ? "200px" : "100px",
                                  objectFit: "cover",
                                  display: "block",
                                  borderRadius: msg.images.length === 1 ? "8px" : "0"
                                }} 
                              />
                            ))}
                          </div>
                        ) : msg.image ? (
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
                        ) : null}
                        {msg.video && (
                          <video 
                            src={`${
                              msg.video?.includes("uploads") 
                                ? import.meta.env.VITE_API_BASE_URL + msg.video 
                                : msg.video 
                            }`}
                            controls
                            style={{ 
                              maxWidth: "100%", 
                              maxHeight: "200px", 
                              borderRadius: "8px", 
                              marginBottom: msg.content ? "8px" : "0",
                              display: "block",
                              backgroundColor: "#000"
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

            {/* File Preview Area */}
            {attachmentPreviews.length > 0 && (
              <div style={{ padding: "0 24px", display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", width: "100%" }}>
                {attachmentPreviews.map((preview, index) => {
                  const isVideo = attachmentFiles[index]?.type?.startsWith("video/");
                  return (
                    <div key={index} style={{ position: "relative", flexShrink: 0 }}>
                      {isVideo ? (
                        <video src={preview} style={{ height: "60px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#000" }} />
                      ) : (
                        <img src={preview} alt={`Preview ${index}`} style={{ height: "60px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", objectFit: "cover" }} />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{ 
                          position: "absolute", top: "-8px", right: "-8px", 
                          background: "rgba(0,0,0,0.6)", borderRadius: "50%", 
                          color: "white", padding: "2px", border: "none", cursor: "pointer", zIndex: 10
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
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
                accept={attachmentType} 
                multiple={isMultiple}
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleImageChange}
              />
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    cursor: "pointer",
                    background: isAttachmentMenuOpen ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <PlusCircle size={24} />
                </div>

                <AnimatePresence>
                  {isAttachmentMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="glass"
                      style={{
                        position: "absolute",
                        bottom: "50px",
                        left: "0",
                        padding: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        borderRadius: "12px",
                        zIndex: 50,
                        minWidth: "200px"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentType("image/*");
                          setIsMultiple(false);
                          setIsAttachmentMenuOpen(false);
                          setTimeout(() => fileInputRef.current?.click(), 0);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          borderRadius: "8px",
                          textAlign: "left",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <ImageIcon size={18} />
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentType("image/*");
                          setIsMultiple(true);
                          setIsAttachmentMenuOpen(false);
                          setTimeout(() => fileInputRef.current?.click(), 0);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          borderRadius: "8px",
                          textAlign: "left",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <ImagesIcon size={18} />
                        Upload Multiple Images
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentType("video/*");
                          setIsMultiple(false);
                          setIsAttachmentMenuOpen(false);
                          setTimeout(() => fileInputRef.current?.click(), 0);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          borderRadius: "8px",
                          textAlign: "left",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <VideoIcon size={18} />
                        Upload Video
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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

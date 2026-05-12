import { Hash, Search, PlusCircle, LogOut, X, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useUserStore from "../store/useUserStore";
import useChatStore from "../store/useChatStore";
import { useLogout } from "../utils/auth.utils";

export default function Sidebar({ onClose }) {
  const { user, isLogoutLoading } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  // ✅ Pull createChat from the store
  const { chats, getChats, setSelectedChat, createChat } = useChatStore();
  const handleLogout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    getChats();
  }, [fetchUsers, getChats]);

  const handleCreateChat = async (userId) => {
    try {
      const chat = await createChat(userId);
      if (chat) navigate(`/chat/${chat._id}`);
      onClose(); // Close sidebar on mobile
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Except current user
  const filteredUsers = users.filter((u) => u._id !== user?._id);

  return (
    <div
      className="glass"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Chats</h2>
          <PlusCircle
            size={20}
            style={{ color: "#94a3b8", cursor: "pointer" }}
          />
          <div
            className="mobile-only"
            style={{
              cursor: "pointer",
              padding: "8px",
              marginRight: "-8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
          >
            <X size={24} style={{ color: "#94a3b8" }} />
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search..."
            style={{
              width: "100%",
              paddingLeft: "40px",
              background: "rgba(255,255,255,0.03)",
              height: "40px",
            }}
          />
          <Search
            size={16}
            color="#64748b"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        <div
          style={{
            padding: "0 16px 8px",
            fontSize: "0.75rem",
            fontWeight: "700",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Recent Chats
        </div>
        {chats?.map((chat) => {
          const otherUser = chat.participants.find(p => p._id !== user?._id);
          if (!otherUser) return null;

          return (
            <NavLink
              key={chat._id}
              to={`/chat/${chat._id}`}
              onClick={() => {
                setSelectedChat(chat);
                onClose();
              }}
              style={({ isActive }) => ({
                padding: "12px 16px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                textDecoration: "none",
                background: isActive ? "rgba(139, 92, 246, 0.1)" : "transparent",
                marginBottom: "4px",
                transition: "background 0.2s",
              })}
            >
              {({ isActive }) => (
                <>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: isActive 
                        ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                        : "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: isActive ? "#fff" : "#94a3b8",
                    }}
                  >
                    {otherUser.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                      style={{
                        color: isActive ? "#fff" : "#94a3b8",
                        fontWeight: isActive ? "600" : "400",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {otherUser.name}
                    </div>
                    {chat.lastMessage && (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.lastMessage.senderId._id === user._id ? "You: " : ""}{chat.lastMessage.content}
                      </div>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}

        <div
          style={{
            marginTop: "24px",
            padding: "0 16px 8px",
            fontSize: "0.75rem",
            fontWeight: "700",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          All Users
        </div>
        {filteredUsers?.map((singleUser) => (
          <div
            key={singleUser._id}
            onClick={() => handleCreateChat(singleUser._id)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
            className="user-item-hover"
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#94a3b8",
              }}
            >
              {singleUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span style={{ 
              color: "#94a3b8",
              fontWeight: "400"
            }}>
              {singleUser.name}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {user?.name[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              fontWeight: "600",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#22c55e" }}>Online</div>
        </div>
        {isLogoutLoading ? (
          <Loader2 className="spin" size={20} style={{ color: "#ef4444" }} />
        ) : (
          <LogOut
            size={20}
            style={{ color: "#ef4444", cursor: "pointer", opacity: 0.7 }}
            onClick={handleLogout}
            title="Logout"
          />
        )}
      </div>
    </div>
  );
}

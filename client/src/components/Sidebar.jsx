import { Hash, Search, PlusCircle, LogOut, X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useUserStore from "../store/useUserStore";
import useChatStore from "../store/useChatStore";
import useGroupChatStore from "../store/useGroupChatStore";
import { useLogout } from "../utils/auth.utils";

export default function Sidebar({ onClose }) {
  const { user, isLogoutLoading } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  // ✅ Pull chats and actions from the store
  const { chats, getChats, setSelectedChat, createChat } = useChatStore();
  const handleLogout = useLogout();
  const navigate = useNavigate();

  // Search and Group states
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
    getChats();
  }, [fetchUsers, getChats]);

  const handleCreateChat = async (userId) => {
    try {
      const chat = await createChat(userId);
      if (chat) navigate(`/chat/${chat._id}`);
      onClose?.(); // Close sidebar on mobile
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Except current user
  const filteredUsers = users.filter((u) => u._id !== user?._id);

  // Filter recent chats based on search input
  const filteredChats = chats?.filter((chat) => {
    const isGroup = chat.isGroupChat;
    const otherUser = isGroup ? null : chat.participants.find(p => p._id !== user?._id);
    const name = isGroup ? chat.chatName : otherUser?.name;
    return name?.toLowerCase().includes(sidebarSearch.toLowerCase());
  });

  // Filter users based on search input
  const filteredAllUsers = filteredUsers?.filter((u) =>
    u.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div
      className="glass"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PlusCircle
              size={22}
              style={{ color: "#8b5cf6", cursor: "pointer", transition: "transform 0.2s" }}
                      onClick={() => { console.log('Opening group modal'); setIsGroupModalOpen(true); }}
              title="Create Group Chat"
              className="hover-scale"
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
              onClick={() => {}}
            >
              <X size={24} style={{ color: "#94a3b8" }} />
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search chats or users..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
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
        {filteredChats?.map((chat) => {
          const isGroup = chat.isGroupChat;
          const otherUser = isGroup ? null : chat.participants.find(p => p._id !== user?._id);
          if (!isGroup && !otherUser) return null;

          const chatName = isGroup ? chat.chatName : otherUser.name;
          const avatarInitials = isGroup 
            ? chat.chatName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
            : otherUser.name[0].toUpperCase();

          const lastMessageSender = chat.lastMessage?.senderId?._id === user?._id 
            ? "You" 
            : chat.lastMessage?.senderId?.name;

          return (
            <NavLink
              key={chat._id}
              to={`/chat/${chat._id}`}
              onClick={() => {
                setSelectedChat(chat);
                onClose?.();
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
                        ? (isGroup ? "linear-gradient(45deg, #ec4899, #8b5cf6)" : "linear-gradient(45deg, #3b82f6, #8b5cf6)")
                        : "rgba(255, 255, 255, 0.05)",
                      border: isGroup && !isActive ? "1px solid rgba(236, 72, 153, 0.3)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: isActive ? "#fff" : (isGroup ? "#ec4899" : "#94a3b8"),
                    }}
                  >
                    {avatarInitials}
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
                      {chatName}
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
                        {lastMessageSender ? `${lastMessageSender}: ` : ""}{chat.lastMessage.content}
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
        {filteredAllUsers?.map((singleUser) => (
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

      {/* Glassmorphic Create Group Modal */}
      {isGroupModalOpen && createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
          onClick={() => setIsGroupModalOpen(false)}
        >
          <div
            className="glass"
            style={{
                width: "90vw",
                maxWidth: "460px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                position: "relative",
                overflow: "auto",
                maxHeight: "calc(100vh - 80px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Create Group Chat
              </h3>
              <X
                size={20}
                style={{ color: "#94a3b8", cursor: "pointer" }}
                onClick={() => setIsGroupModalOpen(false)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design Squad, Friends"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>Add Members (Select at least 2)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={groupSearchQuery}
                    onChange={(e) => setGroupSearchQuery(e.target.value)}
                    style={{ width: "100%", paddingLeft: "40px", height: "40px" }}
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

              {selectedUsers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "80px", overflowY: "auto", padding: "4px" }}>
                  {selectedUsers.map(u => (
                    <div
                      key={u._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(139, 92, 246, 0.15)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        color: "#fff",
                      }}
                    >
                      <span>{u.name}</span>
                      <X
                        size={12}
                        style={{ cursor: "pointer", color: "#ec4899" }}
                        onClick={() => setSelectedUsers(selectedUsers.filter(user => user._id !== u._id))}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.15)",
                  padding: "6px",
                }}
              >                
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredUsers.filter(u => u.name.toLowerCase().includes(groupSearchQuery.toLowerCase())).map(singleUser => {
                  const isSelected = selectedUsers.some(u => u._id === singleUser._id);
                  return (
                    <div
                      key={singleUser._id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedUsers(selectedUsers.filter(u => u._id !== singleUser._id));
                        } else {
                          setSelectedUsers([...selectedUsers, singleUser]);
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.3)',
                          background: isSelected ? '#8b5cf6' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                      </div>
                      <span style={{ color: isSelected ? '#fff' : '#cbd5e1', fontSize: '0.9rem' }}>{singleUser.name}</span>
                    </div>
                  );
                })}
              </div>
  </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <button
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94a3b8",
                  padding: "10px",
                }}
                onClick={() => setIsGroupModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                disabled={!groupName.trim() || selectedUsers.length < 2}
                onClick={async () => {
                  if (!groupName.trim() || selectedUsers.length < 2) return;
                  try {
                    const userIds = selectedUsers.map(u => u._id);
                    const newChat = await useGroupChatStore.getState().createGroupChat(groupName, userIds);
                    if (newChat) navigate(`/chat/${newChat._id}`);
                    setIsGroupModalOpen(false);
                    setGroupName("");
                    setSelectedUsers([]);
                    onClose?.();
                  } catch (error) {
                    console.error("Error creating group:", error);
                  }
                }}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

import { MoreVertical, Hash, Users, Search, Menu, LogOut, Loader2, X, Edit, Plus, Check } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import useGroupChatStore from "../store/useGroupChatStore";
import useUserStore from "../store/useUserStore";
import { useLogout } from "../utils/auth.utils";

export default function Header({ activeChat, onMenuClick }) {
  const { user, isLogoutLoading } = useAuthStore();
  const handleLogout = useLogout();

  // Group settings local states
  const { selectedChat } = useChatStore();
  const { renameGroup, addToGroup, removeFromGroup } = useGroupChatStore();
  const { users } = useUserStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  const handleOpenSettings = () => {
    if (activeChat.isGroupChat && selectedChat) {
      setNewGroupName(selectedChat.chatName);
      setIsSettingsOpen(true);
    }
  };

  return (
    <div
      className="glass"
      style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div 
        style={{ display: "flex", alignItems: "center", gap: "16px", cursor: activeChat.isGroupChat ? "pointer" : "default" }}
        onClick={handleOpenSettings}
        title={activeChat.isGroupChat ? "Click to open Group Settings" : undefined}
      >
        <div
          className="mobile-only"
          style={{
            cursor: "pointer",
            padding: "8px",
            marginLeft: "-8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick();
          }}
        >
          <Menu size={24} style={{ color: "#94a3b8" }} />
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "rgba(139, 92, 246, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {activeChat.isChannel ? (
            <Hash size={24} color="#8b5cf6" />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                background: activeChat.isGroupChat 
                  ? "linear-gradient(45deg, #ec4899, #8b5cf6)" 
                  : "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {activeChat.name
                ? activeChat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "C"}
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
            {activeChat.name}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            {activeChat.isGroupChat 
              ? `${activeChat.participantsCount} members` 
              : "Online"}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", color: "#94a3b8", alignItems: "center" }}>
        <Search size={20} cursor="pointer" />
        
        {activeChat.isGroupChat ? (
          <Users 
            size={20} 
            cursor="pointer" 
            className="desktop-only" 
            style={{ color: "#ec4899" }}
            onClick={handleOpenSettings}
            title="Group Members & Settings"
          />
        ) : (
          <Users size={20} cursor="pointer" className="desktop-only" />
        )}

        <div
          className="mobile-only"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {user?.name[0]?.toUpperCase()}
          </div>
          <div
            style={{
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleLogout}
          >
            {isLogoutLoading ? (
              <Loader2 className="spin" size={20} style={{ color: "#ef4444" }} />
            ) : (
              <LogOut
                size={20}
                style={{ color: "#ef4444", cursor: "pointer", opacity: 0.7 }}
                title="Logout"
              />
            )}
          </div>
        </div>

        {activeChat.isGroupChat ? (
          <MoreVertical 
            size={20} 
            cursor="pointer" 
            className="desktop-only" 
            style={{ color: "#8b5cf6" }}
            onClick={handleOpenSettings}
            title="Group Settings"
          />
        ) : (
          <MoreVertical size={20} cursor="pointer" className="desktop-only" />
        )}
      </div>

      {/* Glassmorphic Group Settings Modal */}
      {isSettingsOpen && selectedChat && selectedChat.isGroupChat && createPortal(
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
            color: "var(--text-main)",
          }}
          onClick={() => {
            setIsSettingsOpen(false);
            setIsRenaming(false);
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: "440px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700" }}>Group Settings</h3>
              <X
                size={20}
                style={{ color: "#94a3b8", cursor: "pointer" }}
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsRenaming(false);
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>Group Name</label>
              {isRenaming ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    style={{ flex: 1, height: "40px" }}
                  />
                  <button
                    className="btn-primary"
                    style={{ padding: "8px 12px", display: "flex", alignItems: "center" }}
                    onClick={async () => {
                      if (!newGroupName.trim()) return;
                      await renameGroup(selectedChat._id, newGroupName);
                      setIsRenaming(false);
                    }}
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontWeight: "600" }}>{selectedChat.chatName}</span>
                  <Edit
                    size={16}
                    style={{ color: "#8b5cf6", cursor: "pointer" }}
                    onClick={() => {
                      setNewGroupName(selectedChat.chatName);
                      setIsRenaming(true);
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              Admin: <span style={{ color: "#ec4899", fontWeight: "600" }}>
                {selectedChat.groupAdmin?._id === user?._id ? "You" : selectedChat.groupAdmin?.name || "Deleted User"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>
                Members ({selectedChat.participants.length})
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
                {selectedChat.participants.map(p => {
                  const isAdmin = selectedChat.groupAdmin?._id === p._id;
                  const isCurrentUser = p._id === user?._id;
                  const canManage = selectedChat.groupAdmin?._id === user?._id && !isCurrentUser;

                  return (
                    <div
                      key={p._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: isCurrentUser ? "linear-gradient(45deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            color: "#fff",
                          }}
                        >
                          {p.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: isCurrentUser ? "600" : "400" }}>
                          {p.name} {isCurrentUser && "(You)"}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isAdmin && (
                          <span style={{ fontSize: "0.7rem", background: "rgba(236, 72, 153, 0.15)", border: "1px solid rgba(236, 72, 153, 0.3)", padding: "2px 8px", borderRadius: "12px", color: "#ec4899", fontWeight: "600" }}>
                            Admin
                          </span>
                        )}
                        {canManage && (
                          <X
                            size={16}
                            style={{ color: "#ef4444", cursor: "pointer" }}
                            title="Remove Member"
                            onClick={async () => {
                              await removeFromGroup(selectedChat._id, p._id, user?._id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedChat.groupAdmin?._id === user?._id && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>Add New Members</label>
                <div style={{ position: "relative", marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Search users to add..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    style={{ width: "100%", paddingLeft: "40px", height: "36px" }}
                  />
                  <Search
                    size={14}
                    color="#64748b"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "120px", overflowY: "auto" }}>
                  {users
                    .filter(u => !selectedChat.participants.some(p => p._id === u._id))
                    .filter(u => u.name.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                    .map(u => (
                      <div
                        key={u._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.01)",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem" }}>{u.name}</span>
                        <button
                          style={{
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "#8b5cf6",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            await addToGroup(selectedChat._id, u._id);
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", marginTop: "8px" }}>
              <button
                style={{
                  width: "100%",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "600",
                }}
                onClick={async () => {
                  if (window.confirm("Are you sure you want to leave this group?")) {
                    await removeFromGroup(selectedChat._id, user?._id, user?._id);
                    setIsSettingsOpen(false);
                  }
                }}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

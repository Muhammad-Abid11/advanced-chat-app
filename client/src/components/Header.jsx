import { MoreVertical, Hash, Users, Search, Menu, LogOut, Loader2 } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useLogout } from "../utils/auth.utils";

export default function Header({ activeChat, onMenuClick }) {
  const { user, isLogoutLoading } = useAuthStore();
  const handleLogout = useLogout();

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
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
          onClick={onMenuClick}
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
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {activeChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
            {activeChat.isChannel ? `${activeChat.name} Channel` : activeChat.name}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            {activeChat.isChannel ? "12 members online" : "Online"}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", color: "#94a3b8" }}>
        <Search size={20} cursor="pointer" />
        <Users size={20} cursor="pointer" className="desktop-only" />
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
        <MoreVertical size={20} cursor="pointer" className="desktop-only" />
      </div>
    </div>
  );
}

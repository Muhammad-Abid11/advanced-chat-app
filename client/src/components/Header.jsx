import { MoreVertical, Hash, Users, Search } from "lucide-react";

export default function Header() {
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
          <Hash size={24} color="#8b5cf6" />
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
            General Channel
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            12 members online
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", color: "#94a3b8" }}>
        <Search size={20} cursor="pointer" />
        <Users size={20} cursor="pointer" />
        <MoreVertical size={20} cursor="pointer" />
      </div>
    </div>
  );
}

import { Hash, Search, PlusCircle } from "lucide-react";

export default function Sidebar({ user }) {
  return (
    <div
      className="glass"
      style={{
        width: "300px",
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
        {["General", "Designers", "Development", "Random"].map((channel, i) => (
          <div
            key={channel}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              background: i === 0 ? "rgba(139, 92, 246, 0.1)" : "transparent",
              marginBottom: "4px",
              transition: "background 0.2s",
            }}
          >
            <Hash size={18} color={i === 0 ? "#8b5cf6" : "#64748b"} />
            <span
              style={{
                color: i === 0 ? "#fff" : "#94a3b8",
                fontWeight: i === 0 ? "600" : "400",
              }}
            >
              {channel}
            </span>
          </div>
        ))}

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
          Direct Messages
        </div>
        {["Sarah Miller", "John Doe", "Alice Freeman"].map((name) => (
          <div
            key={name}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span style={{ color: "#94a3b8" }}>{name}</span>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                marginLeft: "auto",
              }}
            ></div>
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
          {user[0].toUpperCase()}
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
            {user}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#22c55e" }}>Online</div>
        </div>
      </div>
    </div>
  );
}

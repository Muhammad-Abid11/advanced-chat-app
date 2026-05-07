import { MessageSquare } from "lucide-react";

const WelcomeChatScreen = ({ user, setIsSidebarOpen }) => {
    return (
        <div
            className="glass"
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                textAlign: "center",
                padding: "40px",
            }}
        >
            {/* Hamburger for mobile in empty state */}
            <div
                className="mobile-only"
                style={{
                    position: "absolute",
                    top: "40px",
                    left: "40px",
                    cursor: "pointer",
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                }}
                onClick={() => setIsSidebarOpen(true)}
            >
                <MessageSquare size={24} color="#8b5cf6" />
            </div>

            <div
                style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "24px",
                    background: "rgba(139, 92, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8b5cf6",
                }}
            >
                <MessageSquare size={40} />
            </div>
            <div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "12px" }}>
                    Welcome, {user?.name || user?.email?.split("@")[0]}!
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "400px" }}>
                    Select a conversation from the sidebar to start chatting with your team.
                </p>
            </div>
        </div>
    )
}

export default WelcomeChatScreen;
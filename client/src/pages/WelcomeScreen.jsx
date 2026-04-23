import React, { useState } from "react";
import { LogIn, User } from "lucide-react";

const WelcomeScreen = ({ onJoin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="glass glass-card"
        style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <User size={40} color="#8b5cf6" />
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(to right, #fff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          Please enter your good name to join the chat
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Your Good Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "48px",
                height: "56px",
                fontSize: "1rem",
              }}
              required
              autoFocus
            />
            <User
              size={20}
              color="#64748b"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "1.1rem",
            }}
          >
            Join Chat <LogIn size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;

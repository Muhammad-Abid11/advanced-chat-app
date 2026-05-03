import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const SignIn = ({ onToggle, onSignIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="auth-container"
    >
      <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "8px", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Welcome Back
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
        Enter your details to access your account
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: "100%", paddingLeft: "48px", height: "56px" }}
            required
          />
          <Mail
            size={20}
            color="#64748b"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
        </div>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ width: "100%", paddingLeft: "48px", height: "56px" }}
            required
          />
          <Lock
            size={20}
            color="#64748b"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem" }}
        >
          Sign In <LogIn size={20} />
        </button>
      </form>

      <p style={{ marginTop: "24px", color: "#94a3b8" }}>
        Don't have an account?{" "}
        <span
          onClick={onToggle}
          style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: "600" }}
        >
          Sign Up
        </span>
      </p>
    </motion.div>
  );
};

export default SignIn;

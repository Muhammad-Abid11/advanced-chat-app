import React, { useState } from "react";
import { User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { registerApi } from "../api/auth/auth.api";
import useAuthStore from "../store/useAuthStore";
import { connectWebSocket } from "../config/socket";
import ErrorMessage from "./common/ErrorMessage";

const Signup = ({ onToggle }) => {
  const { setUser, setRegisterLoading, isRegisterLoading, error, setError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      const res = await registerApi(formData);
      const { user } = res?.data || {};

      // update global state
      setUser(user);
      setError(null);
      connectWebSocket();
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Registration failed. Try again.";
      setError(message);
    } finally {
      setRegisterLoading(false);
    }
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
        Create Account
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
        Join our community and start chatting
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%", paddingLeft: "48px", height: "56px" }}
            required
          />
          <User
            size={20}
            color="#64748b"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
        </div>

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
          Sign Up {isRegisterLoading ? <Loader2 className="spin" size={20} /> : <UserPlus size={20} />}
        </button>
      </form>

      <p style={{ marginTop: "24px", color: "#94a3b8" }}>
        Already have an account?{" "}
        <span
          onClick={onToggle}
          style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: "600" }}
        >
          Sign In
        </span>
      </p>
    </motion.div>
  );
};

export default Signup;

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Signup from "../components/Signup";
import SignIn from "../components/SignIn";
import useAuthStore from "../store/useAuthStore";

const WelcomeScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setError } = useAuthStore();

  // Clear errors when switching between login/signup
  useEffect(() => {
    setError(null);
  }, [isLogin, setError]);

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
        style={{ maxWidth: "450px", width: "100%", textAlign: "center", overflow: "hidden", }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(139, 92, 246, 0.1)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
          }}
        >
          <MessageSquare size={40} color="#8b5cf6" />
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <SignIn
              key="signin"
              onToggle={() => setIsLogin(false)}
            />
          ) : (
            <Signup
              key="signup"
              onToggle={() => setIsLogin(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomeScreen;

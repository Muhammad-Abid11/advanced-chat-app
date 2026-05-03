import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Signup from "../components/Signup";
import SignIn from "../components/SignIn.Jsx";

const WelcomeScreen = ({ onJoin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (userData) => {
    // For now, we just use the name (from signup) or email prefix (from signin) to join
    if (userData) {
      onJoin(userData);
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
              onSignIn={handleAuth}
            />
          ) : (
            <Signup
              key="signup"
              onToggle={() => setIsLogin(true)}
              onSignUp={handleAuth}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomeScreen;
